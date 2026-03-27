import { jsonSchema } from 'ai';
import { TechnologyType } from '@time-tracking-app/database';
import {
  AI_LOAD_STATUSES,
  AI_PROJECT_DOMAINS,
  AI_SCHEMA_DESCRIPTIONS,
  AI_WORK_FORMATS,
  GetTechByCategoryArgs,
  SearchEmployeesArgs,
  SearchProjectsArgs,
} from '../constants/aichat.constants';

export const getTechSchema = jsonSchema<GetTechByCategoryArgs>({
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: Object.values(TechnologyType),
      description: AI_SCHEMA_DESCRIPTIONS.TECH_CATEGORY,
    },
  },
  required: ['type'],
});

export const searchEmployeesSchema = jsonSchema<SearchEmployeesArgs>({
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      items: { type: 'string' },
      description: AI_SCHEMA_DESCRIPTIONS.SKILLS_LIST,
    },
    limit: { type: 'number', description: AI_SCHEMA_DESCRIPTIONS.EMPLOYEE_LIMIT },
    realName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.REAL_NAME,
    },
    loadStatus: {
      type: 'string',
      enum: AI_LOAD_STATUSES,
      description: AI_SCHEMA_DESCRIPTIONS.LOAD_STATUS,
    },
    workFormat: {
      type: 'string',
      enum: AI_WORK_FORMATS,
      description: AI_SCHEMA_DESCRIPTIONS.WORK_FORMAT,
    },
    excludeNames: {
      type: 'array',
      items: { type: 'string' },
      description: AI_SCHEMA_DESCRIPTIONS.EXCLUDE_NAMES,
    },
    projectDomain: {
      type: 'string',
      enum: AI_PROJECT_DOMAINS,
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_DOMAIN_EMPLOYEE,
    },
  },
});

export const searchProjectsSchema = jsonSchema<SearchProjectsArgs>({
  type: 'object',
  properties: {
    projectName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_NAME,
    },
    projectManagerName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_MANAGER_NAME,
    },
    projectDomain: {
      type: 'string',
      enum: AI_PROJECT_DOMAINS,
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_DOMAIN_PROJECT,
    },
  },
});
