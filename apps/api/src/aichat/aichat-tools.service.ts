import { Injectable } from '@nestjs/common';
import { TechnologyType, Prisma, ProjectDomain } from '@time-tracking-app/database/index';
import {
  AI_CONFIG,
  AI_LOAD_STATUS,
  AI_MESSAGES,
  AI_PROJECT_DOMAIN,
  AI_WORK_FORMAT,
  SearchEmployeesArgs,
  SearchProjectsArgs,
  USER_SYSTEM_ROLE,
} from './constants/aichat.constants';
import { AichatRepository } from './aichat.repository';
import { mapProjectsToAiResponse, mapUsersToAiResponse } from './aichat.mappers';
import { RawProject, RawUser } from './types/aichat.types';

@Injectable()
export class AichatToolsService {
  constructor(private readonly aichatRepo: AichatRepository) {}

  async handleGetTechByCategory(type: TechnologyType) {
    const techs = await this.aichatRepo.getTechnologiesByType(type);
    return techs.map(tech => tech.name);
  }

  async handleSearchEmployees(args: SearchEmployeesArgs) {
    try {
      const loadStatus = args.loadStatus || AI_LOAD_STATUS.ALL;
      const where: Prisma.UserWhereInput = {
        isActive: true,
      };

      if (args.realName) {
        where.OR = [
          { realName: { contains: args.realName, mode: 'insensitive' } },
          { username: { contains: args.realName, mode: 'insensitive' } },
        ];
      } else {
        where.systemRole = USER_SYSTEM_ROLE.EMPLOYEE;

        if (args.skills?.length) {
          where.AND = args.skills.map(skill => ({
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

      if (users.length === 0 && loadStatus !== AI_LOAD_STATUS.OVERLOADED) {
        return this.getAlternatives();
      }

      let processedUsers = mapUsersToAiResponse(
        users as unknown as RawUser[],
        currentYear,
        currentMonth
      );

      if (!args.realName) {
        if (loadStatus === AI_LOAD_STATUS.AVAILABLE) {
          processedUsers = processedUsers.filter(
            u => u.stats.employedTimePercent < AI_CONFIG.FULL_LOAD_PERCENT
          );
          processedUsers.sort((a, b) => a.stats.employedTimePercent - b.stats.employedTimePercent);
        } else if (loadStatus === AI_LOAD_STATUS.OVERLOADED) {
          processedUsers = processedUsers.filter(
            u => u.stats.employedTimePercent > AI_CONFIG.FULL_LOAD_PERCENT
          );
          processedUsers.sort((a, b) => b.stats.employedTimePercent - a.stats.employedTimePercent);
        }
      }

      if (processedUsers.length === 0 && loadStatus !== AI_LOAD_STATUS.OVERLOADED) {
        return this.getAlternatives();
      }

      return processedUsers.slice(0, args.limit || AI_CONFIG.DEFAULT_SEARCH_LIMIT);
    } catch (error) {
      console.log(error);
      return { error: AI_MESSAGES.DB_ERROR_USERS };
    }
  }

  async handleSearchProjects(args: SearchProjectsArgs) {
    try {
      const where: Prisma.ProjectWhereInput = {};
      const andConditions: Prisma.ProjectWhereInput[] = [];

      if (args.projectName) {
        andConditions.push({
          name: { contains: args.projectName, mode: 'insensitive' },
        });
      }

      if (args.projectManagerName) {
        andConditions.push({
          OR: [
            {
              projectManager: {
                realName: { contains: args.projectManagerName, mode: 'insensitive' },
              },
            },
          ],
        });
      }

      if (args.projectDomain && args.projectDomain !== AI_PROJECT_DOMAIN.ANY) {
        andConditions.push({ domain: args.projectDomain as ProjectDomain });
      }

      if (andConditions.length > 0) {
        where.AND = andConditions;
      }

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const projects = await this.aichatRepo.findProjectsWithDetails(
        where,
        startOfMonth,
        endOfMonth
      );

      if (projects.length === 0) {
        return { message: AI_MESSAGES.NO_PROJECTS_FOUND };
      }

      return mapProjectsToAiResponse(projects as unknown as RawProject[]);
    } catch (error) {
      console.error('❌ [SearchProjects] Error executing search:', error);
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
}
