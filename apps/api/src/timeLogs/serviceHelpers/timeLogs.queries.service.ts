import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaService } from '@time-tracking-app/database/index';
import { user } from '../types/timeLogs.types';
import { TIME_LOG_ERRORS } from '../constants/timeLogs.constants';

@Injectable()
export class TimeLogQueriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findLogsByPeriod(user: user, from: string, to: string) {
    const userId = user.sub;
    return this.prisma.timeLog.findMany({
      where: {
        userId: userId,
        date: { gte: new Date(from), lte: new Date(to) },
      },
      orderBy: { date: 'asc' },
      include: { project: { select: { name: true } } },
    });
  }

  async findMissingDays(userId: string, from: string, to: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) throw new NotFoundException(TIME_LOG_ERRORS.USER.NOT_FOUND);

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const existingLogs = await this.prisma.timeLog.findMany({
      where: { userId, date: { gte: fromDate, lte: toDate } },
      select: { date: true },
    });

    const trackedDates = new Set(existingLogs.map(log => log.date.toISOString().split('T')[0]));
    const missingDays: string[] = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (!trackedDates.has(dateString)) missingDays.push(dateString);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return { userId, period: { from, to }, missingDays };
  }

  async getManagerDashboard(from: string, to: string, search?: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const whereClause: Prisma.TimeLogWhereInput = {
      date: { gte: fromDate, lte: toDate },
    };

    if (search) {
      whereClause.OR = [
        { user: { realName: { contains: search, mode: 'insensitive' } } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { project: { projectManager: { realName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    return this.prisma.timeLog.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { id: true, realName: true, email: true, avatarUrl: true } },
        project: {
          select: {
            id: true,
            name: true,
            emoji: true,
            projectManager: { select: { id: true, realName: true, avatarUrl: true } },
          },
        },
      },
    });
  }
}
