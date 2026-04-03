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

export type ValidateResponseArgs = z.infer<typeof validateResponseSchema>;
