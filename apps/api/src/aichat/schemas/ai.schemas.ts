import { jsonSchema } from 'ai';
import { TechnologyType } from '@time-tracking-app/database';
import {
  AI_PROJECT_DOMAINS,
  AI_SCHEMA_DESCRIPTIONS,
  AI_SKILL_FORMATS,
  AI_WORK_FORMATS,
  GetPmPortfolioArgs,
  GetProjectTeamArgs,
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

    minLoadPercent: {
      type: 'number',
      description: AI_SCHEMA_DESCRIPTIONS.MIN_LOAD_PERCENT_DESC,
    },
    maxLoadPercent: {
      type: 'number',
      description: AI_SCHEMA_DESCRIPTIONS.MAX_LOAD_PERCENT_DESC,
    },
    skillMode: {
      type: 'string',
      enum: AI_SKILL_FORMATS,
      description: AI_SCHEMA_DESCRIPTIONS.SKILL_MODE,
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

    systemRole: {
      type: 'string',
      enum: ['EMPLOYEE', 'MANAGER'],
      description: AI_SCHEMA_DESCRIPTIONS.SYSTEM_ROLE_DESC,
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

export const getProjectTeamSchema = jsonSchema<GetProjectTeamArgs>({
  type: 'object',
  properties: {
    projectName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PROJECT_TEAM_NAME_DESC,
    },
  },
  required: ['projectName'],
});

export const getPmPortfolioSchema = jsonSchema<GetPmPortfolioArgs>({
  type: 'object',
  properties: {
    managerName: {
      type: 'string',
      description: AI_SCHEMA_DESCRIPTIONS.PM_PORTFOLIO_MANAGER_DESC,
    },
  },
  required: ['managerName'],
});
