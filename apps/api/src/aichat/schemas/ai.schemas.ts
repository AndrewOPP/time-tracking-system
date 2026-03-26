import { jsonSchema } from 'ai';
import { TechnologyType, UserWorkFormat, ProjectDomain } from '@time-tracking-app/database';

export const getTechSchema = jsonSchema({
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: Object.values(TechnologyType),
    },
  },
  required: ['type'],
});

export const searchEmployeesSchema = jsonSchema({
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      items: { type: 'string' },
    },
    limit: { type: 'number' },
    realName: { type: 'string' },
    workFormat: {
      type: 'string',
      enum: Object.values(UserWorkFormat),
    },
    loadStatus: {
      type: 'string',
      enum: ['AVAILABLE', 'OVERLOADED', 'ALL'],
    },
    projectDomain: {
      type: 'string',
      enum: Object.values(ProjectDomain),
    },
  },
});

export const searchProjectsSchema = jsonSchema({
  type: 'object',
  properties: {
    projectName: { type: 'string' },
    projectManagerName: { type: 'string' },
    projectDomain: {
      type: 'string',
      enum: Object.values(ProjectDomain),
    },
  },
});
