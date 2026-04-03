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
import { validateResponseSchema } from './schemas/ai-validation.schema';

@Injectable()
export class AichatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dbToolsService: AichatToolsService
  ) {}

  // eslint-disable-next-line
  async generateResponseStream(messages: UIMessage[]): Promise<any> {
    try {
      const trimmedMessages = messages.slice(-AI_CONFIG.MAX_HISTORY_MESSAGES);

      return streamText({
        model: openai(this.configService.getOrThrow('AI_MODEL')),
        messages: await convertToModelMessages(trimmedMessages),
        system: `${HR_SYSTEM_PROMPT}${AI_PROMPTS_ADDITIONS.CRITICAL_RULE}`,
        stopWhen: stepCountIs(AI_CONFIG.MAX_AI_STEPS),
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

          //TODO: Left it for the future
          // evaluateCandidates: tool({
          //   description: AI_TOOL_DESCRIPTIONS.EVALUATE_CANDIDATES,
          //   inputSchema: evaluateCandidatesSchema,
          //   execute: async args => {
          //     return this.dbToolsService.handleEvaluateCandidates(args);
          //   },
          // }),
        },
      });
    } catch (error) {
      console.error('AI API Error:', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }
}
