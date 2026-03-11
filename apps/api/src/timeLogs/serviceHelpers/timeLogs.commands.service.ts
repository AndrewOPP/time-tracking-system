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
} from '../dto/timeLogs.controller.dto';
import { user } from '../types/timeLogs.types';
import { Prisma, PrismaService } from '@time-tracking-app/database/index';
import { TIME_LOG_ERRORS } from '../constants/timeLogs.constants';
import { runSerializable } from '../utils/runSerializable';

@Injectable()
export class TimeLogCommandsService {
  constructor(private readonly prisma: PrismaService) {}

  private async _checkDailyHoursLimit(
    tx: Prisma.TransactionClient,
    userId: string,
    date: Date,
    hoursToAdd: number,
    excludeLogId?: string
  ) {
    const aggregate = await tx.timeLog.aggregate({
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

    return await runSerializable(this.prisma, async tx => {
      const project = await tx.project.findUnique({
        where: { id: timeLog.projectId },
        include: { users: { where: { userId } } },
      });

      if (!project) throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
      if (project.users.length === 0)
        throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED);

      await this._checkDailyHoursLimit(tx, userId, targetDate, Number(timeLog.hours));

      return tx.timeLog.create({
        data: {
          hours: timeLog.hours,
          userId,
          projectId: timeLog.projectId,
          date: targetDate,
          description: timeLog.description,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  }

  async updateLog(user: user, logId: string, updateTimeLogData: UpdateTimeLogDto) {
    const userId = user.sub;

    return await runSerializable(this.prisma, async tx => {
      const targetLog = await tx.timeLog.findUnique({ where: { id: logId } });

      if (!targetLog) throw new NotFoundException(TIME_LOG_ERRORS.LOG.NOT_FOUND);
      if (targetLog.userId !== userId)
        throw new ForbiddenException(TIME_LOG_ERRORS.LOG.FORBIDDEN_EDIT);

      if (updateTimeLogData.projectId && updateTimeLogData.projectId !== targetLog.projectId) {
        const projectAccess = await tx.project.findUnique({
          where: { id: updateTimeLogData.projectId },
          include: { users: { where: { userId } } },
        });

        if (!projectAccess) throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
        if (projectAccess.users.length === 0)
          throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED_UPDATE);
      }

      if ('hours' in updateTimeLogData || 'date' in updateTimeLogData) {
        const targetDate = updateTimeLogData.date
          ? new Date(updateTimeLogData.date)
          : targetLog.date;
        const targetHours = updateTimeLogData.hours ?? Number(targetLog.hours);
        await this._checkDailyHoursLimit(tx, userId, targetDate, targetHours, logId);
      }

      const dataToUpdate: Prisma.TimeLogUncheckedUpdateInput = {
        hours: updateTimeLogData.hours,
        projectId: updateTimeLogData.projectId,
        description: updateTimeLogData.description,
        date: updateTimeLogData.date ? new Date(updateTimeLogData.date) : undefined,
      };

      return tx.timeLog.update({
        where: { id: logId },
        data: dataToUpdate,
        include: {
          project: { select: { name: true, id: true } },
        },
      });
    });
  }

  async deleteLog(user: user, logId: string) {
    const userId = user.sub;
    const targetLog = await this.prisma.timeLog.findUnique({ where: { id: logId } });

    if (!targetLog) throw new NotFoundException(TIME_LOG_ERRORS.LOG.NOT_FOUND);
    if (targetLog.userId !== userId)
      throw new ForbiddenException(TIME_LOG_ERRORS.LOG.FORBIDDEN_DELETE);

    return this.prisma.timeLog.delete({ where: { id: logId } });
  }

  async createBulk(user: user, projectId: string, logsToSave: BulkSaveTimeLogDto[]) {
    if (!logsToSave || logsToSave.length === 0) {
      return { message: TIME_LOG_ERRORS.MESSAGES.BULK_EMPTY };
    }

    const userId = user.sub;

    return await runSerializable(this.prisma, async tx => {
      const projectAccess = await tx.project.findUnique({
        where: { id: projectId },
        include: { users: { where: { userId } } },
      });

      if (!projectAccess) throw new NotFoundException(TIME_LOG_ERRORS.PROJECT.NOT_FOUND);
      if (projectAccess.users.length === 0)
        throw new ForbiddenException(TIME_LOG_ERRORS.PROJECT.ACCESS_DENIED);

      const uniqueDates = [...new Set(logsToSave.map(log => log.date))].map(date => new Date(date));

      const existingLogs = await tx.timeLog.findMany({
        where: { userId, date: { in: uniqueDates } },
      });

      const hoursPerDay = new Map<string, number>();
      const incomingIds = logsToSave.map(log => log.id).filter(id => id);

      for (const log of existingLogs) {
        if (Number(log.hours) === 0) continue;
        if (incomingIds.includes(log.id)) continue;

        const dateStr = log.date.toISOString().split('T')[0];
        hoursPerDay.set(dateStr, (hoursPerDay.get(dateStr) || 0) + Number(log.hours));
      }

      for (const log of logsToSave) {
        if (log.hours === 0) continue;

        const dateStr = new Date(log.date).toISOString().split('T')[0];
        const newTotal = (hoursPerDay.get(dateStr) || 0) + log.hours;

        if (newTotal > 24) {
          throw new BadRequestException(TIME_LOG_ERRORS.LOG.LIMIT_EXCEEDED_DATE(dateStr, newTotal));
        }
        hoursPerDay.set(dateStr, newTotal);
      }

      const logsToCreate = logsToSave.filter(log => !log.id && log.hours > 0);

      const logsToUpdate = logsToSave.filter(log => !!log.id && log.hours > 0);

      const logsToDelete = logsToSave.filter(log => !!log.id && log.hours === 0);

      if (logsToCreate.length > 0) {
        await tx.timeLog.createMany({
          data: logsToCreate.map(log => ({
            userId,
            projectId,
            date: new Date(log.date),
            hours: log.hours,
            description: log.description,
          })),
        });
      }

      if (logsToUpdate.length > 0) {
        await Promise.all(
          logsToUpdate.map(log =>
            tx.timeLog.update({
              where: { id: log.id, userId },
              data: {
                hours: log.hours,
                date: new Date(log.date),
                description: log.description,
                projectId,
              },
            })
          )
        );
      }

      if (logsToDelete.length > 0) {
        await tx.timeLog.deleteMany({
          where: {
            id: { in: logsToDelete.map(log => log.id!) },
            userId,
          },
        });
      }

      return { message: TIME_LOG_ERRORS.MESSAGES.BULK_SUCCESS };
    });
  }
}
