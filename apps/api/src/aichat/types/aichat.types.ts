import { TechnologyType, UserWorkFormat, ProjectDomain } from '@time-tracking-app/database/index';

export interface GetTechByCategoryArgs {
  type: TechnologyType;
}

export interface SearchEmployeesArgs {
  skills?: string[];
  limit?: number;
  workFormat?: UserWorkFormat;
  realName?: string;
  projectDomain?: ProjectDomain;
}

export interface SearchProjectsArgs {
  projectName?: string;
  projectManagerName?: string;
  projectDomain?: ProjectDomain;
}

export interface RawProjectManager {
  realName: string | null;
  username: string | null;
  avatarUrl?: string | null;
}

export interface RawUserProject {
  projectId: string;
  project: {
    id: string;
    domain: string;
    name: string;
    projectManager?: RawProjectManager | null;
    avatarUrl?: string | null;
    type: string;
  };
}

export interface RawTimeLog {
  projectId: string;
  userId?: string;
  hours: number | string;
}

export interface RawPtoLog {
  hours: number | string;
}

export interface RawUserTech {
  technology: {
    name: string;
  };
}

export interface RawUser {
  id: string;
  realName: string | null;
  username: string | null;
  email: string;
  workFormat: UserWorkFormat;
  technologies: RawUserTech[];
  projects: RawUserProject[];
  timeLogs: RawTimeLog[];
  ptoLogs: RawPtoLog[];
}

export interface RawProjectTeamMember {
  userId: string;
  position: string;
  user: {
    realName: string | null;
    username: string | null;
  };
}

export interface RawProject {
  name: string;
  status: string;
  domain: string;
  type: string;
  technologies: string[];
  startDate: Date | null;
  projectManager?: RawProjectManager | null;
  users: RawProjectTeamMember[];
  timeLogs: RawTimeLog[];
}
