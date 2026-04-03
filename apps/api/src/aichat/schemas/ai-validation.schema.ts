import { z } from 'zod';
import { AI_VALIDATION_FORMAT, AI_VALIDATION_FORMATS } from '../constants/aichat.constants';

export const validateResponseSchema = z.object({
  responseType: z
    .enum(AI_VALIDATION_FORMATS)
    .describe('CRITICAL: Choose the type of data you are trying to validate.'),

  candidates: z
    .array(
      z.object({
        name: z.string().describe('Real name or username of the candidate'),
        employedTimePercent: z
          .number()
          .optional()
          .describe(
            `Total employed time percentage. Required for ${AI_VALIDATION_FORMAT.EMPLOYEES}, omit for ${AI_VALIDATION_FORMAT.ALTERNATIVES}.`
          ),
        skills: z
          .array(z.string())
          .optional()
          .describe(
            `List of skills. Required for ${AI_VALIDATION_FORMAT.EMPLOYEES}, omit for ${AI_VALIDATION_FORMAT.ALTERNATIVES}.`
          ),
      })
    )
    .optional()
    .describe(
      `Fill this array ONLY if responseType is ${AI_VALIDATION_FORMAT.EMPLOYEES} or ${AI_VALIDATION_FORMAT.ALTERNATIVES}.`
    ),

  projectTeamDetails: z
    .object({
      projectName: z.string(),
      status: z.string(),
      teamMembers: z.array(
        z.object({
          name: z.string(),
          perProjectTotalHours: z.number(),
        })
      ),
    })
    .optional()
    .describe(`Fill this object ONLY if responseType is ${AI_VALIDATION_FORMAT.PROJECT_TEAM}.`),

  pmPortfolioDetails: z
    .object({
      managerName: z.string(),
      projects: z.array(
        z.object({
          name: z.string(),
          teamSize: z.number(),
        })
      ),
    })
    .optional()
    .describe(`Fill this object ONLY if responseType is ${AI_VALIDATION_FORMAT.PM_PORTFOLIO}.`),
});

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
  customWeights: z
    .object({
      skills: z.number().optional(),
      availability: z.number().optional(),
      domain: z.number().optional(),
      risk: z.number().optional(),
    })
    .optional()
    .describe(
      "Provide custom weights (0 to 100) to adapt scoring based on the user's intent:\n" +
        "- 'skills': Give highest weight if specific tech is requested. 🚨 CRITICAL: If no specific technologies/skills are mentioned in the prompt, you MUST set 'skills' to 0.\n" +
        "- 'availability': Give high weight if urgency/free time is mentioned. If not mentioned, set a baseline of 20-30.\n" +
        "- 'domain': Boost ONLY if a specific domain is explicitly requested. 🚨 CRITICAL: If no specific domain is mentioned in the prompt, you MUST set 'domain' to 0.\n" +
        "- 'risk': ALWAYS set to 15, never change it.\n" +
        'The tool will normalize these to equal 100%.'
    ),
});

export type EvaluateCandidatesArgs = z.infer<typeof evaluateCandidatesSchema>;

export type ValidateResponseArgs = z.infer<typeof validateResponseSchema>;
