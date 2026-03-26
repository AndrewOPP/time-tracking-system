import { Injectable } from '@nestjs/common';
import { TechnologyType } from '@time-tracking-app/database/index';

import { SearchEmployeesArgs, SearchProjectsArgs } from './types/aichat.types';
import { AichatRepository } from './aichat.repository';
import { AI_CHAT_CONFIG, AI_CHAT_ERRORS, AI_CHAT_FALLBACKS } from './constants/aichat.constants';

import { buildEmployeeWhereFilter, buildProjectWhereFilter } from './utils/aichat.builders';
import { mapUserStats, mapProjectStats } from './utils/aichat.mappers';
import { getCurrentMonthDateRange, applyLoadStatusFilter } from './utils/aichat.helpers';

@Injectable()
export class AichatToolsService {
  constructor(private readonly repository: AichatRepository) {}

  public async handleGetTechByCategory(type: TechnologyType): Promise<string[]> {
    const techs = await this.repository.getTechnologiesByType(type);
    return techs.map(tech => tech.name);
  }

  public async handleSearchEmployees(args: SearchEmployeesArgs) {
    try {
      const where = buildEmployeeWhereFilter(args);
      const dateRange = getCurrentMonthDateRange();

      const users = await this.repository.findEmployees(where, dateRange);

      if (users.length === 0) return this.getAlternatives();

      let processedUsers = users.map(user => mapUserStats(user));
      processedUsers = applyLoadStatusFilter(processedUsers, args);

      if (processedUsers.length === 0) return this.getAlternatives();

      return processedUsers.slice(0, args.limit || AI_CHAT_CONFIG.DEFAULT_RESULTS_LIMIT);
    } catch (error) {
      console.error(error);
      return { error: AI_CHAT_ERRORS.DB_UNAVAILABLE };
    }
  }

  public async handleSearchProjects(args: SearchProjectsArgs) {
    try {
      const where = buildProjectWhereFilter(args);
      const dateRange = getCurrentMonthDateRange();

      const projects = await this.repository.findProjects(where, dateRange);

      if (projects.length === 0) return { message: AI_CHAT_FALLBACKS.NO_PROJECTS };

      return projects.map(project => mapProjectStats(project));
    } catch (error) {
      console.error(error);
      return { error: AI_CHAT_ERRORS.PROJECTS_UNAVAILABLE };
    }
  }

  private async getAlternatives() {
    const availableUsers = await this.repository.findAlternativeEmployees();
    return {
      notFound: true,
      message: AI_CHAT_FALLBACKS.ALTERNATIVES_MSG,
      alternatives: availableUsers.map(user => ({ name: user.realName || user.username })),
    };
  }
}
