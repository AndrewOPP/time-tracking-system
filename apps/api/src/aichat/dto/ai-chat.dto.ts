import { IsArray } from 'class-validator';
import { UIMessage } from 'ai';
import { TechnologyType } from '@time-tracking-app/database/index';

export class AiChatRequestDto {
  @IsArray()
  messages: UIMessage[];
}

export interface GetTechByCategoryArgs {
  type: TechnologyType;
}

export interface FindEmployeeByNameArgs {
  name: string;
}

export interface SearchEmployeesArgs {
  skills?: string[];
  isAvailableOnly?: boolean;
  limit?: number;
  excludeIds?: string[];
}
