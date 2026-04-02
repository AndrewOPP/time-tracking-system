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
  evaluateCandidatesSchema,
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

          evaluateCandidates: tool({
            description: `
              WHEN TO USE: Call this tool ONLY for complex, analytical queries where you need to RANK, COMPARE, or find the BEST FIT/TOP candidates. 

              WHEN NOT TO USE: DO NOT use for simple list requests (e.g., "Find React devs", "Who knows Python?"). For basic searches, use 'searchEmployees' instead.

              🚨 OUTPUT RULE: Extract ONLY the 'candidates' array. Output it in a \`\`\`json block starting with '[' and ending with ']'.

              🚨 EMPTY STATE: If candidates is [], explain that exact matches are missing. Look at 'availableSkillsContext' and suggest 1-2 logically similar technologies from that list. Ask: "Would you like to see candidates with these similar skills, or show the most available engineers?"

              ROUTING: Standalone tool. DO NOT call any other tools before or after this one.
            `,
            inputSchema: evaluateCandidatesSchema,
            execute: async args => {
              return this.dbToolsService.handleEvaluateCandidates(args);
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
// description: `
//     CORE INTENT: Use ONLY when the user explicitly asks to "evaluate", "compare", "rank", "score", or find the "best fit" / "top candidates" for a project.

//     🚫 STRICT ROUTING RULE: If the user simply asks to find or list people (e.g., "Find React devs", "Who knows Python?"), you MUST use 'searchEmployees' instead. Do NOT use evaluateCandidates as a general search tool.

//     🚨 OUTPUT RULE (CRITICAL): Extract ONLY the candidates array from the tool's response. Output it in a \`\`\`json block starting strictly with '[' and ending with ']'. DO NOT include metadata ('status', 'message', 'appliedWeights') inside the JSON block.

//     ROUTING: ONE-STEP standalone tool. DO NOT call 'searchEmployees' before or 'finalizeAndValidateResponse' after this tool.

//     ALTERNATIVES: If the tool returns status "alternatives_found", explicitly state in your Executive Summary that no exact matches were found and you are suggesting the best alternatives.
//   `
