import { Prisma } from '@time-tracking-app/database/index';
import { SearchEmployeesArgs, SearchProjectsArgs } from '../types/aichat.types';
import { AI_CHAT_DB_VALUES } from '../constants/aichat.constants';

export const buildEmployeeWhereFilter = (args: SearchEmployeesArgs): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = { isActive: true };

  if (args.realName) {
    where.OR = [
      { realName: { contains: args.realName, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE } },
      { username: { contains: args.realName, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE } },
    ];
    return where;
  }
  // eslint-disable-next-line
  where.systemRole = AI_CHAT_DB_VALUES.ROLE_EMPLOYEE as any;

  if (args.skills?.length) {
    where.technologies = {
      some: { technology: { name: { in: args.skills, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE } } },
    };
  }
  if (args.workFormat) {
    where.workFormat = args.workFormat;
  }
  if (args.projectDomain) {
    where.projects = {
      some: { project: { domain: args.projectDomain } },
    };
  }

  return where;
};

export const buildProjectWhereFilter = (args: SearchProjectsArgs): Prisma.ProjectWhereInput => {
  const where: Prisma.ProjectWhereInput = {};

  if (args.projectName) {
    where.name = { contains: args.projectName, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE };
  }
  if (args.projectManagerName) {
    where.projectManager = {
      OR: [
        {
          realName: { contains: args.projectManagerName, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE },
        },
        {
          username: { contains: args.projectManagerName, mode: AI_CHAT_DB_VALUES.MODE_INSENSITIVE },
        },
      ],
    };
  }
  if (args.projectDomain) {
    where.domain = args.projectDomain;
  }

  return where;
};
