import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { HR_SYSTEM_PROMPT } from './constants/aichat.prompts';
import {
  AI_CONFIG,
  AI_PROMPTS_ADDITIONS,
  AI_TOOL_DESCRIPTIONS,
} from './constants/aichat.constants';
import { AichatToolsService } from './aichat-tools.service';
import {
  getTechSchema,
  searchEmployeesSchema,
  getProjectTeamSchema,
  getPmPortfolioSchema,
} from './schemas/ai.schemas';
import { ChatHistoryService } from './aichatHistory.service';
import { evaluateCandidatesSchema, validateResponseSchema } from './schemas/ai-validation.schema';

@Injectable()
export class AichatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dbToolsService: AichatToolsService,
    private readonly chatHistoryService: ChatHistoryService
  ) {}

  async generateResponseStream(
    messages: UIMessage[],
    userId: string,
    chatId?: string
    // eslint-disable-next-line
  ): Promise<any> {
    try {
      const currentChatId = chatId;

      if (!currentChatId) {
        throw new InternalServerErrorException('Failed to find chat id');
      }

      const userMessages = messages.filter(m => m.role === 'user');
      const lastUserMessage = userMessages[userMessages.length - 1];

      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        // Точно так же достаем текст из последнего сообщения
        const lastUserTextPart = lastMessage.parts?.find(p => p.type === 'text') as
          | { text: string }
          | undefined;

        await this.chatHistoryService.saveMessage(
          currentChatId,
          'user',
          lastUserTextPart?.text || ''
        );
      }

      if (userMessages.length === 1 && lastUserMessage) {
        const firstUserText = (
          lastUserMessage.parts?.find(p => p.type === 'text') as { text?: string }
        )?.text;

        if (firstUserText) {
          await this.chatHistoryService.updateChatTitle(chatId, firstUserText);
        }
      }

      const trimmedMessages = messages.slice(-AI_CONFIG.MAX_HISTORY_MESSAGES);

      const result = streamText({
        model: openai(this.configService.getOrThrow('AI_MODEL')),
        messages: await convertToModelMessages(trimmedMessages),
        system: `${HR_SYSTEM_PROMPT}${AI_PROMPTS_ADDITIONS.CRITICAL_RULE}`,
        stopWhen: stepCountIs(AI_CONFIG.MAX_AI_STEPS),

        onFinish: async ({ text }) => {
          if (text) {
            await this.chatHistoryService.saveMessage(currentChatId, 'assistant', text);
          }
        },

        tools: {
          getTechnologiesByCategory: tool({
            description: AI_TOOL_DESCRIPTIONS.GET_TECH_BY_CATEGORY,
            inputSchema: getTechSchema,
            execute: async ({ type }) => {
              return this.dbToolsService.handleGetTechByCategory(type);
            },
          }),

          searchEmployees: tool({
            description: AI_TOOL_DESCRIPTIONS.SEARCH_EMPLOYEES,
            inputSchema: searchEmployeesSchema,
            execute: async args => {
              return this.dbToolsService.handleSearchEmployees({
                ...args,
              });
            },
          }),

          getProjectTeam: tool({
            description: AI_TOOL_DESCRIPTIONS.GET_PROJECT_TEAM,
            inputSchema: getProjectTeamSchema,
            execute: async args => {
              return this.dbToolsService.handleGetProjectTeam(args);
            },
          }),

          getPmPortfolio: tool({
            description: AI_TOOL_DESCRIPTIONS.GET_PM_PORTFOLIO,
            inputSchema: getPmPortfolioSchema,
            execute: async args => {
              return this.dbToolsService.handleGetPmPortfolio(args);
            },
          }),

          finalizeAndValidateResponse: tool({
            description: AI_TOOL_DESCRIPTIONS.FINALIZE_AND_VALIDATE_RESPONSE,
            inputSchema: validateResponseSchema,
            execute: async args => {
              return this.dbToolsService.handleFinalizeAndValidateResponse(args);
            },
          }),

          evaluateCandidates: tool({
            description: AI_TOOL_DESCRIPTIONS.EVALUATE_CANDIDATES,
            inputSchema: evaluateCandidatesSchema,
            execute: async args => {
              return this.dbToolsService.handleEvaluateCandidates(args);
            },
          }),
        },
      });

      return { result, chatId: currentChatId };
    } catch (error) {
      console.error('AI API Error:', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }
}
