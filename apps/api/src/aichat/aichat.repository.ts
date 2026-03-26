import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  TechnologyType,
  UserStatus,
  Prisma,
} from '@time-tracking-app/database/index';
import { AI_CHAT_CONFIG, AI_CHAT_DB_VALUES } from './constants/aichat.constants';

@Injectable()
export class AichatRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getTechnologiesByType(type: TechnologyType) {
    return this.prisma.technology.findMany({
      where: { type },
      select: { name: true },
    });
  }

  public async findEmployees(where: Prisma.UserWhereInput, dateRange: { gte: Date; lte: Date }) {
    return this.prisma.user.findMany({
      where,
      include: {
        technologies: { include: { technology: true }, orderBy: { rating: 'desc' } },
        projects: {
          // eslint-disable-next-line
          where: { status: AI_CHAT_DB_VALUES.STATUS_ACTIVE as any },
          include: { project: { include: { projectManager: true } } },
        },
        timeLogs: { where: { date: dateRange } },
        ptoLogs: { where: { date: dateRange } },
      },
      take: AI_CHAT_CONFIG.MAX_DB_TAKE,
    });
  }

  public async findProjects(where: Prisma.ProjectWhereInput, dateRange: { gte: Date; lte: Date }) {
    return this.prisma.project.findMany({
      where,
      include: {
        projectManager: true,
        users: { include: { user: true } },
        timeLogs: { where: { date: dateRange } },
      },
      take: AI_CHAT_CONFIG.DEFAULT_RESULTS_LIMIT,
    });
  }

  public async findAlternativeEmployees() {
    return this.prisma.user.findMany({
      where: {
        // eslint-disable-next-line
        systemRole: AI_CHAT_DB_VALUES.ROLE_EMPLOYEE as any,
        isActive: true,
        status: UserStatus.ACTIVE,
        // eslint-disable-next-line
        projects: { none: { status: AI_CHAT_DB_VALUES.STATUS_ACTIVE as any } },
      },
      take: AI_CHAT_CONFIG.ALTERNATIVES_TAKE,
    });
  }
}
