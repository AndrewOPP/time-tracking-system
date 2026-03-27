import { Injectable } from '@nestjs/common';
import {
  PrismaService,
  TechnologyType,
  UserStatus,
  Prisma,
} from '@time-tracking-app/database/index';
import { AI_CONFIG, PROJECT_STATUS, USER_SYSTEM_ROLE } from './constants/aichat.constants';

@Injectable()
export class AichatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTechnologiesByType(type: TechnologyType) {
    return this.prisma.technology.findMany({
      where: { type },
      select: { name: true },
    });
  }

  async findUsersWithDetails(
    where: Prisma.UserWhereInput,
    firstDayOfMonth: Date,
    lastDayOfMonth: Date
  ) {
    return this.prisma.user.findMany({
      where,
      include: {
        technologies: { include: { technology: true }, orderBy: { rating: 'desc' } },
        projects: {
          where: { status: PROJECT_STATUS.ACTIVE },
          include: { project: { include: { projectManager: true } } },
        },
        timeLogs: { where: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } } },
        ptoLogs: { where: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } } },
      },
      take: AI_CONFIG.USERS_FETCH_LIMIT,
    });
  }

  async findProjectsWithDetails(
    where: Prisma.ProjectWhereInput,
    startOfMonth: Date,
    endOfMonth: Date
  ) {
    return this.prisma.project.findMany({
      where,
      include: {
        projectManager: true,
        users: { include: { user: true } },
        timeLogs: { where: { date: { gte: startOfMonth, lte: endOfMonth } } },
      },
      take: AI_CONFIG.PROJECTS_FETCH_LIMIT,
    });
  }

  async findAvailableUsersAlternatives() {
    return this.prisma.user.findMany({
      where: {
        systemRole: USER_SYSTEM_ROLE.EMPLOYEE,
        isActive: true,
        status: UserStatus.ACTIVE,
        projects: { none: { status: PROJECT_STATUS.ACTIVE } },
      },
      take: AI_CONFIG.ALTERNATIVES_FETCH_LIMIT,
    });
  }
}
