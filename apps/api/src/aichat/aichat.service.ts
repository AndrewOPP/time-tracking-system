import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { HR_SYSTEM_PROMPT } from './constants/aichat.prompts';
import {
  AI_CONFIG,
  AI_PROMPTS_ADDITIONS,
  AI_TOOL_DESCRIPTIONS,
  AI_LOAD_STATUS,
} from './constants/aichat.constants';
import { cleanMessages } from './utils/cleanHistory';
import { AichatToolsService } from './aichat-tools.service';
import { getTechSchema, searchEmployeesSchema, searchProjectsSchema } from './schemas/ai.schemas';

@Injectable()
export class AichatService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dbToolsService: AichatToolsService
  ) {}

  // eslint-disable-next-line
  async generateResponseStream(messages: UIMessage[]): Promise<any> {
    try {
      const cleanHistory = cleanMessages(messages);
      const trimmedMessages = cleanHistory.slice(-AI_CONFIG.MAX_HISTORY_MESSAGES);

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
                loadStatus: args.loadStatus || AI_LOAD_STATUS.ALL,
              });
            },
          }),

          searchProjects: tool({
            description: AI_TOOL_DESCRIPTIONS.SEARCH_PROJECTS,
            inputSchema: searchProjectsSchema,
            execute: async args => {
              return this.dbToolsService.handleSearchProjects(args);
            },
          }),
        },
      });
    } catch (error) {
      console.error('AI API Error:', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }
}
