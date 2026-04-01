import { jsonSchema } from 'ai';
import { TechnologyType } from '@time-tracking-app/database';
import {
  AI_PROJECT_DOMAINS,
  AI_SCHEMA_DESCRIPTIONS,
  AI_SKILL_FORMATS,
  AI_WORK_FORMATS,
  GetPmPortfolioArgs,
  GetProjectTeamArgs,
  GetTechByCategoryArgs,
  SearchEmployeesArgs,
  SearchProjectsArgs,
} from '../constants/aichat.constants';
import { z } from 'zod';
export const getTechSchema = jsonSchema<GetTechByCategoryArgs>({
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: Object.values(TechnologyType),
      description: AI_SCHEMA_DESCRIPTIONS.TECH_CATEGORY,
    },
  },
  required: ['type'],
});

export const searchEmployeesSchema = jsonSchema<SearchEmployeesArgs>({
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      items: { type: 'string' },
      description: AI_SCHEMA_DESCRIPTIONS.SKILLS_LIST,
    },
    limit: { type: 'number', description: AI_SCHEMA_DESCRIPTIONS.EMPLOYEE_LIMIT },
    realName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.REAL_NAME,
    },

    minLoadPercent: {
      type: 'number',
      description: AI_SCHEMA_DESCRIPTIONS.MIN_LOAD_PERCENT_DESC,
    },
    maxLoadPercent: {
      type: 'number',
      description: AI_SCHEMA_DESCRIPTIONS.MAX_LOAD_PERCENT_DESC,
    },
    skillMode: {
      type: 'string',
      enum: AI_SKILL_FORMATS,
      description: AI_SCHEMA_DESCRIPTIONS.SKILL_MODE,
    },
    workFormat: {
      type: 'string',
      enum: AI_WORK_FORMATS,
      description: AI_SCHEMA_DESCRIPTIONS.WORK_FORMAT,
    },
    excludeNames: {
      type: 'array',
      items: { type: 'string' },
      description: AI_SCHEMA_DESCRIPTIONS.EXCLUDE_NAMES,
    },
    projectDomain: {
      type: 'string',
      enum: AI_PROJECT_DOMAINS,
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_DOMAIN_EMPLOYEE,
    },

    systemRole: {
      type: 'string',
      enum: ['EMPLOYEE', 'MANAGER'],
      description: AI_SCHEMA_DESCRIPTIONS.SYSTEM_ROLE_DESC,
    },
  },
});

export const searchProjectsSchema = jsonSchema<SearchProjectsArgs>({
  type: 'object',
  properties: {
    projectName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_NAME,
    },
    projectManagerName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_MANAGER_NAME,
    },
    projectDomain: {
      type: 'string',
      enum: AI_PROJECT_DOMAINS,
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_DOMAIN_PROJECT,
    },
  },
});

export const getProjectTeamSchema = jsonSchema<GetProjectTeamArgs>({
  type: 'object',
  properties: {
    projectName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_TEAM_NAME_DESC,
    },
  },
  required: ['projectName'],
});

export const getPmPortfolioSchema = jsonSchema<GetPmPortfolioArgs>({
  type: 'object',
  properties: {
    managerName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PM_PORTFOLIO_MANAGER_DESC,
    },
  },
  required: ['managerName'],
});

// export const evaluateCandidatesSchema = jsonSchema<EvaluateCandidatesArgs>({
//   type: 'object',
//   properties: {
//     projectName: {
//       type: 'string',
//       description: AI_SCHEMA_DESCRIPTIONS.EVALUATE_PROJECT_NAME_DESC,
//     },
//     candidateNames: {
//       type: 'array',
//       items: { type: 'string' },
//       description: AI_SCHEMA_DESCRIPTIONS.EVALUATE_PROJECT_NAME_DESC,
//     },
//   },
//   required: ['projectName', 'candidateNames'],
// });

// export const candidateScoringSchema = z.object({
//   candidates: z
//     .array(
//       z.object({
//         name: z.string().describe('Real name of the candidate'),
//         totalScore: z.number().describe('Weighted final score from 0 to 100'),
//         criteria: z.object({
//           skillsMatch: z.object({
//             score: z.number().min(0).max(100),
//             reasoning: z.string().describe('Explanation, e.g., "Missing: Node.js"'),
//           }),
//           availability: z.object({
//             score: z.number().min(0).max(100),
//             reasoning: z
//               .string()
//               .describe('Explanation, e.g., "25% capacity available (40h). Format: Part-time"'),
//           }),
//           domainExperience: z.object({
//             score: z.number().min(0).max(100),
//             reasoning: z.string().describe('Explanation, e.g., "Worked on 2 FoodTech projects"'),
//           }),
//           riskLevel: z.object({
//             score: z.number().min(0).max(100),
//             reasoning: z.string().describe('Explanation, e.g., "Overloaded: 105%, 24h overtime"'),
//           }),
//         }),
//       })
//     )
//     .describe('Array of candidates ranked from highest totalScore to lowest'),
// });

export const evaluateCandidatesSchema = z.object({
  requiredSkills: z
    .array(z.string())
    .describe(
      'Exact skills explicitly named by the user. DO NOT guess, infer, or hallucinate related tech. Return [] if none specified.'
    ),
  targetDomain: z
    .string()
    .optional()
    .describe('Project domain, e.g., "FoodTech". Return "" if none specified.'),
  limit: z.number().optional().default(3).describe('How many top candidates to return'),
  loadStatus: z
    .enum(['overload', 'available', ''])
    .optional()
    .default('')
    .describe(
      'Filter by workload status: "overload" (load > 100%), "available" (load < 90%), or empty string for all candidates'
    ),
});

export type EvaluateCandidatesArgs = z.infer<typeof evaluateCandidatesSchema>;
