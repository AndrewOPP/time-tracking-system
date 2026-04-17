import { Injectable } from '@nestjs/common';
import { TimeLogCommandsService } from './serviceHelpers/timeLogs.commands.service';
import { TimeLogQueriesService } from './serviceHelpers/timeLogs.queries.service';
import {
  BulkSaveTimeLogDto,
  CreateTimeLogDto,
  UpdateTimeLogDto,
} from './dto/timeLogs.controller.dto';
import { user } from './types/timeLogs.types';

@Injectable()
export class TimeLogsService {
  constructor(
    private readonly commands: TimeLogCommandsService,
    private readonly queries: TimeLogQueriesService
  ) {}

  // --- COMMANDS ---
  async createLog(user: user, timeLog: CreateTimeLogDto) {
    return this.commands.createLog(user, timeLog);
  }

  async updateLog(user: user, logId: string, updateTimeLogData: UpdateTimeLogDto) {
    return this.commands.updateLog(user, logId, updateTimeLogData);
  }

  async deleteLog(user: user, logId: string) {
    return this.commands.deleteLog(user, logId);
  }

  async createBulk(user: user, projectId: string, logsToSave: BulkSaveTimeLogDto[]) {
    return this.commands.createBulk(user, projectId, logsToSave);
  }

  // --- QUERIES ---
  async findLogsByPeriod(user: user, from: string, to: string, projectId?: string) {
    return this.queries.findLogsByPeriod(user, from, to, projectId);
  }

  async findMissingDays(userId: string, from: string, to: string) {
    return this.queries.findMissingDays(userId, from, to);
  }

  async getManagerDashboard(from: string, to: string, search?: string) {
    return this.queries.getManagerDashboard(from, to, search);
  }
}
