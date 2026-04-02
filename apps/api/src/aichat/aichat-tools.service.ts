import { Injectable } from '@nestjs/common';
import { TechnologyType, Prisma, ProjectDomain } from '@time-tracking-app/database/index';
import {
  AI_CONFIG,
  AI_MESSAGES,
  AI_PROJECT_DOMAIN,
  AI_SCHEMA_DESCRIPTIONS,
  AI_SKILL_FORMATS_OBJ,
  AI_VALIDATION_FORMAT,
  AI_WORK_FORMAT,
  GetPmPortfolioArgs,
  GetProjectTeamArgs,
  SearchEmployeesArgs,
  TOOL_RETURN_STATUS,
  USER_SYSTEM_ROLE,
} from './constants/aichat.constants';
import { AichatRepository } from './aichat.repository';
import { mapProjectsToAiResponse, mapUsersToAiResponse } from './aichat.mappers';
import { RawProject, RawUser } from './types/aichat.types';
import { ValidateResponseArgs } from './schemas/ai-validation.schema';
import { normalizeString } from './utils/string';

@Injectable()
export class AichatToolsService {
  constructor(private readonly aichatRepo: AichatRepository) {}

  async handleGetTechByCategory(type: TechnologyType) {
    const techs = await this.aichatRepo.getTechnologiesByType(type);
    return techs.map(tech => tech.name);
  }

  async handleSearchEmployees(args: SearchEmployeesArgs) {
    try {
      const where: Prisma.UserWhereInput = {
        isActive: true,
      };

      if (args.realName) {
        where.OR = [
          { realName: { contains: args.realName, mode: 'insensitive' } },
          { username: { contains: args.realName, mode: 'insensitive' } },
        ];
      } else {
        where.systemRole = args.systemRole || USER_SYSTEM_ROLE.EMPLOYEE;

        const actualSkillMode = args.skillMode || AI_SKILL_FORMATS_OBJ.OR;
        if (args.skills?.length && actualSkillMode === AI_SKILL_FORMATS_OBJ.AND) {
          where.AND = args.skills.map(skill => ({
            technologies: {
              some: { technology: { name: { equals: skill, mode: 'insensitive' } } },
            },
          }));
        }

        if (args.skills?.length && actualSkillMode === AI_SKILL_FORMATS_OBJ.OR) {
          where.OR = args.skills.map(skill => ({
            technologies: {
              some: { technology: { name: { equals: skill, mode: 'insensitive' } } },
            },
          }));
        }

        if (args.excludeNames && args.excludeNames.length > 0) {
          where.NOT = {
            OR: [{ realName: { in: args.excludeNames } }, { username: { in: args.excludeNames } }],
          };
        }

        if (args.workFormat && args.workFormat !== AI_WORK_FORMAT.ANY) {
          where.workFormat = args.workFormat;
        }

        if (args.projectDomain && args.projectDomain !== AI_PROJECT_DOMAIN.ANY) {
          where.projects = {
            some: {
              project: { domain: args.projectDomain as ProjectDomain },
            },
          };
        }
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

      const users = await this.aichatRepo.findUsersWithDetails(
        where,
        firstDayOfMonth,
        lastDayOfMonth
      );

      const totalSkillUsers = users.length;

      if (users.length === 0) {
        return this.getAlternatives();
      }

      let processedUsers = mapUsersToAiResponse(
        users as unknown as RawUser[],
        currentYear,
        currentMonth
      );

      if (!args.realName) {
        if (args.minLoadPercent !== undefined) {
          processedUsers = processedUsers.filter(
            u => u.aiStats.employedTimePercent >= args.minLoadPercent!
          );
        }

        if (args.maxLoadPercent !== undefined) {
          processedUsers = processedUsers.filter(
            u => u.aiStats.employedTimePercent <= args.maxLoadPercent!
          );
        }

        processedUsers.sort(
          (a, b) => b.aiStats.employedTimePercent - a.aiStats.employedTimePercent
        );
      }

      if (processedUsers.length === 0) {
        const alternatives = await this.getAlternatives();
        return {
          status: TOOL_RETURN_STATUS.NOT_FOUND,
          data: alternatives,
          _system_instruction: AI_SCHEMA_DESCRIPTIONS.ALTERNATIVES_SYS_INSTRUCTION,
        };
      }

      const finalUsers = processedUsers.slice(0, args.limit || AI_CONFIG.DEFAULT_SEARCH_LIMIT);

      return {
        status: TOOL_RETURN_STATUS.SUCCESS,
        data: finalUsers,
        meta: {
          totalAvailable: processedUsers.length,
          totalOverall: totalSkillUsers,
          returned: finalUsers.length,
        },
        _system_instruction: AI_SCHEMA_DESCRIPTIONS.EMPLOYEE_SEARCH_SYS_INSTRUCTION,
      };
    } catch (error) {
      console.log(error);
      return { error: AI_MESSAGES.DB_ERROR_USERS };
    }
  }

  async handleGetProjectTeam(args: GetProjectTeamArgs) {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const normalizedQuery = normalizeString(args.projectName);

      if (!normalizedQuery) {
        return { message: AI_MESSAGES.NO_PROJECTS_FOUND };
      }

      const firstWord = normalizedQuery.split(' ')[0];

      const projects = await this.aichatRepo.findProjectsWithDetails(
        { name: { contains: firstWord, mode: 'insensitive' } },
        startOfMonth,
        endOfMonth
      );

      const matchedProjects = projects.filter(project => {
        const normalizedProjectName = normalizeString(project.name);
        return normalizedProjectName.includes(normalizedQuery);
      });

      if (matchedProjects.length === 0) return { message: AI_MESSAGES.NO_PROJECTS_FOUND };

      const mappedProjects = mapProjectsToAiResponse(matchedProjects as unknown as RawProject[]);

      return {
        status: TOOL_RETURN_STATUS.SUCCESS,
        data: mappedProjects,
        _system_instruction: AI_SCHEMA_DESCRIPTIONS.GET_PROJECT_TEAM_SYS_INSTUCRION,
      };
    } catch (error) {
      console.log(error);

      return { error: AI_MESSAGES.PROJECT_DATA_ERROR };
    }
  }

  async handleGetPmPortfolio(args: GetPmPortfolioArgs) {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const projects = await this.aichatRepo.findProjectsWithDetails(
        {
          projectManager: {
            realName: { contains: args.managerName, mode: 'insensitive' },
          },
        },
        startOfMonth,
        endOfMonth
      );

      if (projects.length === 0) return { message: AI_MESSAGES.NO_PROJECTS_FOUND };
      const mappedProjects = mapProjectsToAiResponse(projects as unknown as RawProject[]);

      return {
        status: TOOL_RETURN_STATUS.SUCCESS,
        data: mappedProjects,
        _system_instruction: AI_SCHEMA_DESCRIPTIONS.GET_PM_PROJECTS_SYS_INSTUCRION,
      };
    } catch (error) {
      console.log(error);
      return { error: AI_MESSAGES.PROJECT_DATA_ERROR };
    }
  }

  async getAlternatives() {
    const availableUsers = await this.aichatRepo.findAvailableUsersAlternatives();
    return {
      notFound: true,
      message: AI_MESSAGES.EXACT_MATCH_NOT_FOUND,
      alternatives: availableUsers.map(user => ({ name: user.realName || user.username })),
    };
  }

  async handleFinalizeAndValidateResponse(args: ValidateResponseArgs) {
    const errors: string[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    try {
      if (args.responseType === AI_VALIDATION_FORMAT.EMPLOYEES && args.candidates) {
        const candidateNames = args.candidates.map(c => c.name);

        if (candidateNames.length > 0) {
          const users = await this.aichatRepo.findUsersWithDetails(
            {
              OR: [{ realName: { in: candidateNames } }, { username: { in: candidateNames } }],
            },
            firstDayOfMonth,
            lastDayOfMonth
          );

          const mappedUsers = mapUsersToAiResponse(
            users as unknown as RawUser[],
            currentYear,
            currentMonth
          );

          for (const candidate of args.candidates) {
            const realUser = mappedUsers.find(u => u.name === candidate.name);

            if (!realUser) {
              errors.push(
                `Validation Error: Candidate "${candidate.name}" does not exist in the database. Remove them from your response.`
              );
              continue;
            }

            if (
              candidate.employedTimePercent !== undefined &&
              candidate.employedTimePercent !== realUser.aiStats.employedTimePercent
            ) {
              errors.push(
                `Validation Error: Candidate "${candidate.name}" has an ACTUAL employed time of ${realUser.aiStats.employedTimePercent}%, NOT ${candidate.employedTimePercent}%. Update your data.`
              );
            }

            if (candidate.skills && candidate.skills.length > 0) {
              const realSkillsLower = realUser.skills.map(s => s.toLowerCase());
              for (const claimedSkill of candidate.skills) {
                if (claimedSkill === AI_MESSAGES.NO_SKILLS) continue;

                if (!realSkillsLower.includes(claimedSkill.toLowerCase())) {
                  errors.push(
                    `Validation Error: Candidate "${candidate.name}" does NOT have the skill "${claimedSkill}". Their actual skills are: ${realUser.skills.join(', ')}.`
                  );
                }
              }
            }
          }
        }
      }

      if (args.responseType === AI_VALIDATION_FORMAT.ALTERNATIVES && args.candidates) {
        const users = await this.aichatRepo.findAvailableUsersAlternatives();

        for (const candidate of args.candidates) {
          const exists = users.some(
            u => u.realName === candidate.name || u.username === candidate.name
          );
          if (!exists) {
            errors.push(
              `Validation Error: Alternative candidate "${candidate.name}" is not in the list of available alternatives.`
            );
          }
        }
      }

      if (args.responseType === AI_VALIDATION_FORMAT.PROJECT_TEAM && args.projectTeamDetails) {
        const projects = await this.aichatRepo.findProjectsWithDetails(
          { name: { equals: args.projectTeamDetails.projectName, mode: 'insensitive' } },
          firstDayOfMonth,
          lastDayOfMonth
        );
        if (projects.length === 0) {
          errors.push(
            `Validation Error: Project "${args.projectTeamDetails.projectName}" does not exist.`
          );
        }
      }

      if (args.responseType === AI_VALIDATION_FORMAT.PM_PORTFOLIO && args.pmPortfolioDetails) {
        const projects = await this.aichatRepo.findProjectsWithDetails(
          {
            projectManager: {
              realName: { contains: args.pmPortfolioDetails.managerName, mode: 'insensitive' },
            },
          },
          firstDayOfMonth,
          lastDayOfMonth
        );

        if (projects.length === 0) {
          errors.push(
            `Validation Error: Project Manager "${args.pmPortfolioDetails.managerName}" does not exist or has no active projects.`
          );
        }
      }

      if (errors.length > 0) {
        return {
          status: TOOL_RETURN_STATUS.VALIDATION_FAILED,
          message:
            'CRITICAL: You hallucinated or distorted data. Fix the errors below and call this tool again.',
          errors: errors,
        };
      }

      return {
        status: TOOL_RETURN_STATUS.SUCCESS,
        message:
          'Data successfully validated against the database. You are now authorized to stream the final response to the user using this EXACT data.',
      };
    } catch (error) {
      console.error('Validation Tool Error:', error);
      return { error: 'Internal validation error.' };
    }
  }

  // DOTO: left in for the future
  // async handleEvaluateCandidates(args: EvaluateCandidatesArgs) {
  //   try {
  //     const currentDate = new Date();
  //     const currentYear = currentDate.getFullYear();
  //     const currentMonth = currentDate.getMonth();
  //     const startOfMonth = new Date(currentYear, currentMonth, 1);
  //     const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

  //     const projects = await this.aichatRepo.findProjectsWithDetails(
  //       { name: { contains: args.projectName, mode: 'insensitive' } },
  //       startOfMonth,
  //       endOfMonth
  //     );
  //     if (projects.length === 0) return { error: AI_MESSAGES.NO_PROJECTS_FOUND };
  //     const targetProject = projects[0];

  //     const users = await this.aichatRepo.findUsersWithDetails(
  //       {
  //         OR: args.candidateNames.map(name => ({
  //           realName: { contains: name, mode: 'insensitive' },
  //         })),
  //       },
  //       startOfMonth,
  //       endOfMonth
  //     );

  //     const mappedUsers = mapUsersToAiResponse(
  //       users as unknown as RawUser[],
  //       currentYear,
  //       currentMonth
  //     );
  //     // eslint-disable-next-line
  //     const approved: any[] = [];
  //     // eslint-disable-next-line
  //     const rejected: any[] = [];

  //     mappedUsers.forEach(user => {
  //       let score = 1.0;
  //       const rejectReasons: string[] = [];

  //       if (user.aiStats.employedTimePercent >= 100) {
  //         score -= 0.6;
  //         rejectReasons.push(
  //           `Overloaded: current workload is ${user.aiStats.employedTimePercent}%.`
  //         );
  //       } else if (user.aiStats.employedTimePercent > 80) {
  //         score -= 0.3;
  //         rejectReasons.push(
  //           `High workload (${user.aiStats.employedTimePercent}%), risk of delays.`
  //         );
  //       }

  //       if (user.aiStats.untracked > 10) {
  //         score -= 0.2;
  //         rejectReasons.push(`Has ${user.aiStats.untracked}% untracked time.`);
  //       }

  //       const evaluationResult = {
  //         name: user.name,
  //         score: Number(score.toFixed(1)),
  //         stats: user.aiStats,
  //         reasons: rejectReasons.length > 0 ? rejectReasons : ['Perfect fit time-wise'],
  //       };

  //       if (score >= 0.5) {
  //         approved.push(evaluationResult);
  //       } else {
  //         rejected.push(evaluationResult);
  //       }
  //     });

  //     return {
  //       status: 'success',
  //       projectDetails: { name: targetProject.name, domain: targetProject.domain },
  //       evaluation: { approved, rejected },
  //       _system_instruction: `
  //         Format candidate evaluation results for project targetProject.name.

  //         RULES:
  //         1. Show "✅ Approved Candidates" first. Explain their score >= 0.5.
  //         3. Use reasons and score for explanation.

  //         Template:
  //         ### **[Name]** (Score: [X.X])
  //         - 📊 **Workload:** [X]%
  //         - 💡 **Verdict:** [Explanation based on reasons]
  //       `,
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return { error: 'Error evaluating candidates.' };
  //   }
  // }
}
