import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PrismaService,
  TechnologyType,
  UserStatus,
  Prisma,
} from '@time-tracking-app/database/index';
import { streamText, convertToModelMessages, UIMessage, tool, jsonSchema, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { HR_SYSTEM_PROMPT } from './constants/aichat.prompts';
import {
  FindEmployeeByNameArgs,
  GetTechByCategoryArgs,
  SearchEmployeesArgs,
} from './dto/ai-chat.dto';

@Injectable()
export class AichatService {
  constructor(private readonly prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generateResponseStream(messages: UIMessage[]): Promise<any> {
    try {
      const result = streamText({
        model: openai('gpt-4o-mini'),
        messages: await convertToModelMessages(messages),
        system: HR_SYSTEM_PROMPT,
        stopWhen: stepCountIs(6),
        tools: {
          getTechnologiesByCategory: tool({
            description: 'Retrieves technology names for a category (BACKEND, FRONTEND, etc.).',
            inputSchema: jsonSchema<GetTechByCategoryArgs>({
              type: 'object',
              properties: {
                type: { type: 'string', enum: Object.values(TechnologyType) },
              },
            }),
            execute: args => this.handleGetTechByCategory(args),
          }),

          findEmployeeByName: tool({
            description: 'Finds employee roles in projects by name.',
            inputSchema: jsonSchema<FindEmployeeByNameArgs>({
              type: 'object',
              properties: { name: { type: 'string' } },
              required: ['name'],
            }),
            execute: args => this.handleFindEmployeeByName(args),
          }),

          searchEmployees: tool({
            description: 'Searches employees by skills and availability.',
            inputSchema: jsonSchema<SearchEmployeesArgs>({
              type: 'object',
              properties: {
                skills: { type: 'array', items: { type: 'string' } },
                isAvailableOnly: { type: 'boolean' },
                limit: { type: 'number', description: 'Number of employees to return' },
                excludeIds: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'IDs of employees to exclude from search results',
                },
              },
            }),
            execute: args => this.handleSearchEmployees(args),
          }),
        },
      });

      return result;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }

  private async handleGetTechByCategory({ type }: GetTechByCategoryArgs) {
    const techs = await this.prisma.technology.findMany({
      where: { type },
      select: { name: true },
    });
    return techs.map(t => t.name);
  }

  private async handleFindEmployeeByName({ name }: FindEmployeeByNameArgs) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { realName: { contains: name, mode: 'insensitive' } },
            { username: { contains: name, mode: 'insensitive' } },
          ],
        },
        include: { projects: { include: { project: true } } },
      });

      if (!user) return { message: 'Employee not found.' };

      return {
        name: user.realName || user.username,
        projects: user.projects.map(p => ({
          projectName: p.project.name,
          position: p.position,
          status: p.status,
        })),
      };
    } catch (error) {
      return { error: 'Database error, error' + error };
    }
  }

  private async handleSearchEmployees({
    skills,
    isAvailableOnly,
    limit,
    excludeIds,
  }: SearchEmployeesArgs) {
    try {
      const where: Prisma.UserWhereInput = {
        systemRole: 'EMPLOYEE',
        isActive: true,
        id: excludeIds?.length ? { notIn: excludeIds } : undefined,
      };

      if (isAvailableOnly) {
        where.projects = { none: { status: 'ACTIVE' } };
      }

      if (skills?.length) {
        where.technologies = {
          some: { technology: { name: { in: skills, mode: 'insensitive' } } },
        };
      }

      const users = await this.prisma.user.findMany({
        where,
        include: {
          technologies: { include: { technology: true }, orderBy: { rating: 'desc' } },
          projects: { where: { status: 'ACTIVE' }, include: { project: true } },
        },
        take: limit || 5,
      });

      if (users.length === 0) return this.getAlternatives();

      return users.map(user => ({
        id: user.id,
        name: user.realName || user.username || user.email,
        skills: user.technologies.map(t => `${t.technology.name} (${t.rating})`),
        activeProjects: user.projects.map(p => p.project.name),
        projectCount: user.projects.length,
        status: user.projects.length > 0 ? 'Busy' : 'Available',
      }));
    } catch (error) {
      console.log(error);

      return { error: 'Database unavailable, error:' + error };
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
      alternatives: availableUsers.map(u => ({ name: u.realName || u.username })),
    };
  }
}
