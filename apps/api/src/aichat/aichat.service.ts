import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrismaService,
  TechnologyType,
  UserStatus,
  Prisma,
  UserWorkFormat,
  ProjectDomain,
} from '@time-tracking-app/database/index';
import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs, jsonSchema } from 'ai';
import { openai } from '@ai-sdk/openai';
import { HR_SYSTEM_PROMPT } from './constants/aichat.prompts';
import { calculateEmployedTimeData } from 'src/timeLogs/utils/employedTimeCalculator';
import { getWeeksForMonth } from 'src/timeLogs/utils/monthToWeeks';
import { PROJECT_TYPE, TIMELOGS_QUERIES_CONFIG } from 'src/timeLogs/constants/timeLogs.constants';
import { cleanMessages } from './utils/cleanHistory';

interface GetTechByCategoryArgs {
  type: TechnologyType;
}

interface SearchEmployeesArgs {
  skills?: string[];
  limit?: number;
  workFormat?: UserWorkFormat;
  realName?: string;
  loadStatus?: 'AVAILABLE' | 'OVERLOADED' | 'ALL';
  projectDomain?: ProjectDomain;
}

interface SearchProjectsArgs {
  projectName?: string;
  projectManagerName?: string;
  projectDomain?: ProjectDomain;
}

@Injectable()
export class AichatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}
  // eslint-disable-next-line
  async generateResponseStream(messages: UIMessage[]): Promise<any> {
    try {
      const cleanHistory = cleanMessages(messages);
      const MAX_MESSAGES = 1;
      const trimmedMessages = cleanHistory.slice(-MAX_MESSAGES);

      return streamText({
        model: openai(this.configService.getOrThrow('AI_MODEL')),
        messages: await convertToModelMessages(trimmedMessages),
        system: `${HR_SYSTEM_PROMPT}\n\nCRITICAL RULE: If the user asks about a specific person by name (e.g., "Andrew"), you MUST call 'searchEmployees' with the 'realName' parameter. DO NOT pass any other filters like 'skills' or 'loadStatus' when searching by name!`,
        stopWhen: stepCountIs(6),
        tools: {
          getTechnologiesByCategory: tool({
            description:
              'CRITICAL: ALWAYS call this FIRST when the user asks for developers by role (e.g., "backend", "frontend", "design"). It returns the exact list of skills that you MUST pass into searchEmployees.',
            inputSchema: jsonSchema<GetTechByCategoryArgs>({
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: Object.values(TechnologyType),
                  description: 'Category of tech',
                },
              },
              required: ['type'],
            }),
            execute: async ({ type }) => {
              return this.handleGetTechByCategory(type);
            },
          }),

          searchEmployees: tool({
            description:
              'Searches employees by skills, workload, availability, OR real name. WARNING: If searching by specific name, ONLY pass realName, do NOT pass skills. If searching by one specific thing, NEVER add any more parameters',
            inputSchema: jsonSchema<SearchEmployeesArgs>({
              type: 'object',
              properties: {
                skills: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of skills (e.g., ["React"])',
                },
                limit: { type: 'number', description: 'Number of employees to return. Default 5.' },
                realName: {
                  type: 'string',
                  description:
                    'Real name of the employee. Use this if the user asks for a specific person.',
                },
                loadStatus: {
                  type: 'string',
                  enum: ['AVAILABLE', 'OVERLOADED', 'ALL'],
                  description:
                    'CRITICAL: Set to "ALL" by default. ONLY use "AVAILABLE" or "OVERLOADED" if the user EXPLICITLY mentioned workload or availability in the prompt.',
                },
                workFormat: {
                  type: 'string',
                  description:
                    'OMIT this field unless the user specifically asks for FULL_TIME or PART_TIME.',
                },
                projectDomain: {
                  type: 'string',
                  description:
                    'OMIT this field unless a specific domain (e.g. Fintech) is explicitly mentioned in the user prompt.',
                },
              },
            }),
            execute: async ({ skills, limit, realName, workFormat, loadStatus, projectDomain }) => {
              return this.handleSearchEmployees({
                skills,
                limit,
                realName,
                workFormat,
                loadStatus: loadStatus || 'ALL',
                projectDomain,
              });
            },
          }),

          searchProjects: tool({
            description: 'Searches for projects by name, Project Manager, or domain.',
            inputSchema: jsonSchema<SearchProjectsArgs>({
              type: 'object',
              properties: {
                projectName: {
                  type: 'string',
                  description:
                    'Name of the project. DO NOT split names with commas, hyphens, or "and". "Rolfson, Jones and Fahey" is ONE full project name. NEVER extract a manager name from it.',
                },
                projectManagerName: {
                  type: 'string',
                  description:
                    'Name of the PM. OMIT THIS FIELD ENTIRELY unless the user explicitly asks for a Project Manager (e.g., "managed by Johan").',
                },
                projectDomain: {
                  type: 'string',
                  enum: Object.values(ProjectDomain),
                  description:
                    "OMIT THIS FIELD ENTIRELY unless the user explicitly types the exact domain name in their prompt. DO NOT guess, DO NOT infer, DO NOT pick a random domain. If there is no exact domain word in the user's message, THIS FIELD MUST BE OMITTED.",
                },
              },
            }),
            execute: async ({ projectName, projectManagerName, projectDomain }) => {
              return this.handleSearchProjects({ projectName, projectManagerName, projectDomain });
            },
          }),
        },
      });
    } catch (error) {
      console.error('AI API Error:', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  private async handleGetTechByCategory(type: TechnologyType) {
    const techs = await this.prisma.technology.findMany({
      where: { type },
      select: { name: true },
    });
    return techs.map(tech => tech.name);
  }

  private async handleSearchEmployees(args: {
    skills?: string[];
    limit?: number;
    realName?: string;
    workFormat?: UserWorkFormat;
    loadStatus: 'AVAILABLE' | 'OVERLOADED' | 'ALL';
    projectDomain?: ProjectDomain;
  }) {
    console.log('\n--- 🚀 AI SEARCH EMPLOYEES: INCOMING ARGS ---');
    console.log('Skills:', args.skills);
    console.log('Real Name:', args.realName ? `'${args.realName}'` : 'not provided');
    console.log('Load Status:', args.loadStatus);
    console.log('Work Format:', args.workFormat || 'any');
    console.log('Project Domain:', args.projectDomain || 'any');
    console.log('Limit:', args.limit || 5);
    console.log('---------------------------------------------\n');

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
        where.systemRole = 'EMPLOYEE';

        if (args.skills?.length) {
          where.technologies = {
            some: { technology: { name: { in: args.skills, mode: 'insensitive' } } },
          };
        }

        if (args.workFormat) {
          where.workFormat = args.workFormat;
        }

        if (args.projectDomain) {
          where.projects = {
            some: {
              project: { domain: args.projectDomain },
            },
          };
        }
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

      const users = await this.prisma.user.findMany({
        where,
        include: {
          technologies: { include: { technology: true }, orderBy: { rating: 'desc' } },
          projects: {
            where: { status: 'ACTIVE' },
            include: { project: { include: { projectManager: true } } },
          },
          timeLogs: { where: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } } },
          ptoLogs: { where: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } } },
        },
        take: 50,
      });

      if (users.length === 0) {
        console.log('⚠️ No users found in DB for these filters.');
        return this.getAlternatives();
      }

      let processedUsers = users.map(user => {
        const totalUserHours = user.timeLogs.reduce((sum, log) => sum + Number(log.hours), 0);
        const ptoHours = user.ptoLogs.reduce((sum, log) => sum + Number(log.hours), 0);

        const projectsData = user.projects.map(up => {
          const projectLogs = user.timeLogs.filter(log => log.projectId === up.projectId);
          const perProjectTotal = projectLogs.reduce((sum, log) => sum + Number(log.hours), 0);

          return {
            id: up.project.id,
            name: up.project.name,
            pm:
              up.project.projectManager?.realName ||
              up.project.projectManager?.username ||
              'Unassigned',
            type: up.project.type === 'BILLABLE' ? PROJECT_TYPE.billable : PROJECT_TYPE.nonBillable,
            perProjectTotal,
          };
        });

        const hoursPerDay = user.workFormat === UserWorkFormat.PART_TIME ? 4 : 8;
        let weeksInfo = getWeeksForMonth(currentYear, currentMonth + 1, hoursPerDay);

        weeksInfo = weeksInfo.filter(
          week =>
            week.weekNumber <= TIMELOGS_QUERIES_CONFIG.weekNumberRange || week.workingHours > 0
        );

        const stats = calculateEmployedTimeData({
          totalUserHours: totalUserHours + ptoHours,
          weeksInfo: weeksInfo,
          // eslint-disable-next-line
          projects: projectsData as any,
        });

        return {
          id: user.id,
          name: user.realName || user.username || user.email,
          skills:
            user.technologies.length > 0
              ? user.technologies.map(t => t.technology.name)
              : ['No skills listed'],
          workFormat: user.workFormat,
          activeProjects: projectsData.map(p => ({
            name: p.name,
            pm: p.pm,
            hoursSpent: p.perProjectTotal,
          })),
          stats,
          ptoHours,
          totalLoggedHours: totalUserHours,
        };
      });

      // Логика фильтрации по нагрузке
      if (!args.realName) {
        if (args.loadStatus === 'AVAILABLE') {
          processedUsers = processedUsers.filter(u => u.stats.employedTimePercent < 100);
          processedUsers.sort((a, b) => a.stats.employedTimePercent - b.stats.employedTimePercent);
        } else if (args.loadStatus === 'OVERLOADED') {
          processedUsers = processedUsers.filter(u => u.stats.employedTimePercent > 100);
          processedUsers.sort((a, b) => b.stats.employedTimePercent - a.stats.employedTimePercent);
        }
      }

      // 📊 ЛОГ РЕЗУЛЬТАТОВ ОБРАБОТКИ
      console.log(`✅ Found ${users.length} raw users. After filtering: ${processedUsers.length}`);
      if (processedUsers.length > 0) {
        console.log('Sample result name:', processedUsers[0].name);
      }

      if (processedUsers.length === 0) return this.getAlternatives();

      return processedUsers.slice(0, args.limit || 5);
    } catch (error) {
      console.error(`❌ Failed to map user projects:`, error);
      return { error: 'Database is currently unavailable.' };
    }
  }

  private async handleSearchProjects(args: {
    projectName?: string;
    projectManagerName?: string;
    projectDomain?: ProjectDomain;
  }) {
    try {
      const where: Prisma.ProjectWhereInput = { AND: [] };

      if (args.projectName) {
        // eslint-disable-next-line
        (where.AND as any[]).push({
          name: { contains: args.projectName, mode: 'insensitive' },
        });
      }

      if (args.projectManagerName) {
        // eslint-disable-next-line
        (where.AND as any[]).push({
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

      if (args.projectDomain && !args.projectDomain) {
        // eslint-disable-next-line
        (where.AND as any[]).push({ domain: args.projectDomain });
      }
      // eslint-disable-next-line
      if ((where.AND as any[]).length === 0) {
        delete where.AND;
      }

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      const projects = await this.prisma.project.findMany({
        where,
        include: {
          projectManager: true,
          users: { include: { user: true } },
          timeLogs: { where: { date: { gte: startOfMonth, lte: endOfMonth } } },
        },
        take: 5,
      });

      if (projects.length === 0) return { message: 'No projects found.' };

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
            project.projectManager?.realName || project.projectManager?.username || 'Unassigned',
          type: project.type,
          startDate: project.startDate,
          totalTeamMembers: teamMembers.length,
          totalProjectHoursThisMonth: totalProjectHours,
          teamMembers,
        };
      });
    } catch (error) {
      console.error(`Failed to search projects:`, error);
      return { error: 'Could not retrieve project data.' };
    }
  }

  private async getAlternatives() {
    const availableUsers = await this.prisma.user.findMany({
      where: {
        systemRole: 'EMPLOYEE',
        isActive: true,
        status: UserStatus.ACTIVE,
        projects: { none: { status: 'ACTIVE' } },
      },
      take: 3,
    });
    return {
      notFound: true,
      message: 'Exact match not found. Showing alternative available employees.',
      alternatives: availableUsers.map(user => ({ name: user.realName || user.username })),
    };
  }
}
