import { Injectable } from '@nestjs/common';
import {
  TechnologyType,
  Prisma,
  UserWorkFormat,
  ProjectDomain,
} from '@time-tracking-app/database/index';
import { calculateEmployedTimeData } from 'src/timeLogs/utils/employedTimeCalculator';
import { getWeeksForMonth } from 'src/timeLogs/utils/monthToWeeks';
import { PROJECT_TYPE, TIMELOGS_QUERIES_CONFIG } from 'src/timeLogs/constants/timeLogs.constants';
import {
  AI_CONFIG,
  AI_LOAD_STATUS,
  AI_MESSAGES,
  AI_PROJECT_DOMAIN,
  AI_WORK_FORMAT,
  SearchEmployeesArgs,
  SearchProjectsArgs,
  UserSystemRole,
} from './constants/aichat.constants';
import { AichatRepository } from './aichat.repository';
import { ProjectData } from 'src/timeLogs/types/timeLogs.types';

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
        where.systemRole = UserSystemRole.EMPLOYEE;

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

      let processedUsers = users.map(user => {
        const totalUserHours = user.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);
        const ptoHours = user.ptoLogs.reduce((sum, log) => sum + Number(log.hours), 0);

        const projectsData: ProjectData[] = user.projects.map(up => {
          const projectLogs = user.timeLogs.filter(log => log.projectId === up.projectId);
          const perProjectTotal = projectLogs.reduce((sum, log) => sum + Number(log.hours), 0);

          return {
            projectId: up.project.id,
            projectName: up.project.name,
            pmName:
              up.project.projectManager?.realName ||
              up.project.projectManager?.username ||
              AI_MESSAGES.UNASSIGNED_PM,
            pmAvatarUrl: up.project.projectManager?.avatarUrl || null,
            projectAvatarUrl: up.project.avatarUrl ?? '',
            type:
              up.project.type === PROJECT_TYPE.billable
                ? PROJECT_TYPE.billable
                : PROJECT_TYPE.nonBillable,
            perProjectTotal,
            weeks: {
              week1: 0,
              week2: 0,
              week3: 0,
              week4: 0,
              week5: 0,
              week6: 0,
            },
          };
        });

        const hoursPerDay =
          user.workFormat === UserWorkFormat.PART_TIME
            ? AI_CONFIG.PART_TIME_HOURS
            : AI_CONFIG.FULL_TIME_HOURS;

        let weeksInfo = getWeeksForMonth(currentYear, currentMonth + 1, hoursPerDay);

        weeksInfo = weeksInfo.filter(
          week =>
            week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
        );

        const stats = calculateEmployedTimeData({
          totalUserHours: totalUserHours + ptoHours,
          weeksInfo: weeksInfo,
          projects: projectsData,
        });

        return {
          id: user.id,
          name: user.realName || user.username || user.email,
          skills:
            user.technologies.length > 0
              ? user.technologies.map(t => t.technology.name)
              : [AI_MESSAGES.NO_SKILLS],
          workFormat: user.workFormat,
          activeProjects: projectsData.map(p => ({
            name: p.projectName,
            pm: p.pmName,
            hoursSpent: p.perProjectTotal,
          })),
          stats,
          ptoHours,
          totalLoggedHours: totalUserHours,
        };
      });

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
    console.log('\n--- 🔍 AI SEARCH PROJECTS: INCOMING ARGS ---');
    console.log(JSON.stringify(args, null, 2));
    console.log('--------------------------------------------\n');

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
            {
              projectManager: {
                username: { contains: args.projectManagerName, mode: 'insensitive' },
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

      // 🛠 ЛОГ: Смотрим, какой WHERE уходит в Prisma
      console.log('📝 [SearchProjects] Prisma WHERE clause:');
      console.log(JSON.stringify(where, null, 2));

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const projects = await this.aichatRepo.findProjectsWithDetails(
        where,
        startOfMonth,
        endOfMonth
      );

      // 🛠 ЛОГ: Сколько проектов нашли
      console.log(`✅ [SearchProjects] Found projects count: ${projects.length}`);

      if (projects.length === 0) {
        console.log('⚠️ [SearchProjects] Returning NO_PROJECTS_FOUND message');
        return { message: AI_MESSAGES.NO_PROJECTS_FOUND };
      }

      return projects.map(project => {
        const teamMembers = project.users.map(up => {
          const userLogsOnProject = project.timeLogs.filter(log => log.userId === up.userId);
          const perProjectTotal = userLogsOnProject.reduce(
            (sum, log) => sum + Number(log.hours),
            0
          );

          return {
            name: up.user.realName || up.user.username,
            position: up.position,
            perProjectTotalHours: perProjectTotal,
          };
        });

        const totalProjectHours = project.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);

        return {
          projectName: project.name,
          status: project.status,
          domain: project.domain,
          projectManager:
            project.projectManager?.realName ||
            project.projectManager?.username ||
            AI_MESSAGES.UNASSIGNED_PM,
          type: project.type,
          startDate: project.startDate,
          totalTeamMembers: teamMembers.length,
          totalProjectHoursThisMonth: totalProjectHours,
          teamMembers,
        };
      });
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
