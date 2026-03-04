import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BulkSaveTimeLogDto,
  CreateTimeLogDto,
  UpdateTimeLogDto,
} from './dto/timeLogs.controller.dto';
import { user } from './types/timeLogs.types';
import { Prisma, PrismaService } from '@time-tracking-app/database/index';
import { TIME_LOG_ERRORS } from './constants/timeLogs.constants';

// I will add pagination for getManagerDashboard and findLogsByPeriod in the future.

@Injectable()
export class TimeLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async _checkDailyHoursLimit(
    userId: string,
    date: Date,
    hoursToAdd: number,
    excludeLogId?: string
  ) {
    const aggregate = await this.prisma.timeLog.aggregate({
      where: {
        userId,
        date,
        id: excludeLogId ? { not: excludeLogId } : undefined,
      },
      _sum: { hours: true },
    });

    const existingHours = Number(aggregate._sum.hours || 0);
    const total = existingHours + hoursToAdd;

    if (total > 24) {
      throw new BadRequestException(TIME_LOG_ERRORS.LOG.LIMIT_EXCEEDED(total));
    }
  }

  async createLog(user: user, timeLog: CreateTimeLogDto) {
    const userId = user.sub;
    const targetDate = new Date(timeLog.date);

    const project = await this.prisma.project.findUnique({
      where: {
        id: timeLog.projectId,
      },
      include: {
        users: {
          where: { userId: userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
    }

    if (project.users.length === 0) {
      throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED);
    }

    await this._checkDailyHoursLimit(userId, targetDate, Number(timeLog.hours));

    const newLog = await this.prisma.timeLog.create({
      data: {
        hours: timeLog.hours,
        userId: userId,
        projectId: timeLog.projectId,
        date: targetDate,
        description: timeLog.description,
      },
    });

    return newLog;
  }

  async updateLog(user: user, logId: string, updateTimeLogData: UpdateTimeLogDto) {
    const userId = user.sub;

    const targetLog = await this.prisma.timeLog.findUnique({
      where: {
        id: logId,
      },
    });

    if (!targetLog) {
      throw new NotFoundException(TIME_LOG_ERRORS.LOG.NOT_FOUND);
    }

    if (targetLog.userId !== userId) {
      throw new ForbiddenException(TIME_LOG_ERRORS.LOG.FORBIDDEN_EDIT);
    }

    if (updateTimeLogData.projectId && updateTimeLogData.projectId !== targetLog.projectId) {
      const projectAccess = await this.prisma.project.findUnique({
        where: { id: updateTimeLogData.projectId },
        include: { users: { where: { userId } } },
      });

      if (!projectAccess) {
        throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
      }

      if (projectAccess.users.length === 0) {
        throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED_UPDATE);
      }
    }

    if ('hours' in updateTimeLogData || 'date' in updateTimeLogData) {
      const targetDate = updateTimeLogData.date ? new Date(updateTimeLogData.date) : targetLog.date;
      const targetHours = updateTimeLogData.hours ?? Number(targetLog.hours);

      await this._checkDailyHoursLimit(userId, targetDate, targetHours, logId);
    }

    const dataToUpdate: Prisma.TimeLogUncheckedUpdateInput = {
      hours: updateTimeLogData.hours,
      projectId: updateTimeLogData.projectId,
      description: updateTimeLogData.description,
    };

    if (updateTimeLogData.date) {
      dataToUpdate.date = new Date(updateTimeLogData.date);
    }

    const updatedLog = await this.prisma.timeLog.update({
      where: { id: logId },
      data: dataToUpdate,
    });
    return updatedLog;
  }

  async deleteLog(user: user, logId: string) {
    const userId = user.sub;

    const targetLog = await this.prisma.timeLog.findUnique({
      where: {
        id: logId,
      },
    });

    if (!targetLog) {
      throw new NotFoundException(TIME_LOG_ERRORS.LOG.NOT_FOUND);
    }

    if (targetLog.userId !== userId) {
      throw new ForbiddenException(TIME_LOG_ERRORS.LOG.FORBIDDEN_DELETE);
    }

    const deletedLog = await this.prisma.timeLog.delete({
      where: {
        id: logId,
      },
    });

    return deletedLog;
  }

  async findLogsByPeriod(user: user, from: string, to: string) {
    const userId = user.sub;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const logs = await this.prisma.timeLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return logs;
  }

  async createBulk(user: user, logsToSave: BulkSaveTimeLogDto[]) {
    if (!logsToSave || logsToSave.length === 0) {
      return { message: TIME_LOG_ERRORS.MESSAGES.BULK_EMPTY };
    }

    const userId = user.sub;
    const targetProjectId = logsToSave[0].projectId;

    const projectAccess = await this.prisma.project.findUnique({
      where: { id: targetProjectId },
      include: {
        users: { where: { userId: userId } },
      },
    });

    if (!projectAccess) {
      throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
    }
    if (projectAccess.users.length === 0) {
      throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED);
    }

    const uniqueDates = [...new Set(logsToSave.map(log => log.date))].map(date => new Date(date));

    const existingLogs = await this.prisma.timeLog.findMany({
      where: {
        userId: userId,
        date: { in: uniqueDates },
      },
    });

    const hoursPerDay = new Map<string, number>();
    const incomingIds = logsToSave.map(log => log.id).filter(id => id);

    for (const log of existingLogs) {
      if (incomingIds.includes(log.id)) {
        continue;
      }
      const dateStr = log.date.toISOString().split('T')[0];
      const currentHours = hoursPerDay.get(dateStr) || 0;
      hoursPerDay.set(dateStr, currentHours + Number(log.hours));
    }

    for (const log of logsToSave) {
      const dateStr = new Date(log.date).toISOString().split('T')[0];
      const currentTotal = hoursPerDay.get(dateStr) || 0;
      const newTotal = currentTotal + log.hours;

      if (newTotal > 24) {
        throw new BadRequestException(TIME_LOG_ERRORS.LOG.LIMIT_EXCEEDED_DATE(dateStr, newTotal));
      }
      hoursPerDay.set(dateStr, newTotal);
    }

    const transactionQueries = logsToSave.map(log => {
      const logDate = new Date(log.date);

      if (log.id) {
        return this.prisma.timeLog.update({
          where: { id: log.id, userId: userId },
          data: {
            hours: log.hours,
            description: log.description,
            projectId: targetProjectId,
          },
        });
      } else {
        return this.prisma.timeLog.create({
          data: {
            userId: userId,
            projectId: targetProjectId,
            date: logDate,
            hours: log.hours,
            description: log.description,
          },
        });
      }
    });

    await this.prisma.$transaction(transactionQueries);

    return { message: TIME_LOG_ERRORS.MESSAGES.BULK_SUCCESS };
  }

  async findMissingDays(userId: string, from: string, to: string) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      throw new NotFoundException(TIME_LOG_ERRORS.USER.NOT_FOUND);
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const existingLogs = await this.prisma.timeLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },

      select: {
        date: true,
      },
    });

    const trackedDates = new Set(existingLogs.map(log => log.date.toISOString().split('T')[0]));

    const missingDays: string[] = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateString = currentDate.toISOString().split('T')[0];

        if (!trackedDates.has(dateString)) {
          missingDays.push(dateString);
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
    return {
      userId,
      period: { from, to },
      missingDays,
    };
  }

  async getManagerDashboard(from: string, to: string, search?: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const whereClause: Prisma.TimeLogWhereInput = {
      date: {
        gte: fromDate,
        lte: toDate,
      },
    };

    if (search) {
      whereClause.OR = [
        { user: { realName: { contains: search, mode: 'insensitive' } } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { project: { projectManager: { realName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const logs = await this.prisma.timeLog.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            realName: true,
            email: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            emoji: true,
            projectManager: {
              select: {
                id: true,
                realName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return logs;
  }
}
