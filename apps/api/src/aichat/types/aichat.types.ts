import { TechnologyType, UserWorkFormat, ProjectDomain } from '@time-tracking-app/database/index';

export interface GetTechByCategoryArgs {
  type: TechnologyType;
}

export interface SearchEmployeesArgs {
  skills?: string[];
  limit?: number;
  workFormat?: UserWorkFormat;
  realName?: string;
  loadStatus?: 'AVAILABLE' | 'OVERLOADED' | 'ALL';
  projectDomain?: ProjectDomain;
}

export interface SearchProjectsArgs {
  projectName?: string;
  projectManagerName?: string;
  projectDomain?: ProjectDomain;
}
