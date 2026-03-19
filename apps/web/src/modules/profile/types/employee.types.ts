export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ACCOUNTANT' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type UserWorkFormat = 'FULL_TIME' | 'PART_TIME';

export type TechnologyType = 'BACKEND' | 'FRONTEND' | 'GENERAL' | 'DESIGN' | 'AI';

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';

export type ProjectType = 'BILLABLE' | 'NON_BILLABLE';

export type UserProjectPosition =
  | 'DEVELOPER'
  | 'DESIGNER'
  | 'PROJECT_MANAGER'
  | 'QA'
  | 'TEAM_LEAD'
  | 'TECH_LEAD'
  | 'HELPER'
  | 'OTHER';

export type UserProjectStatus = 'ACTIVE' | 'INACTIVE' | 'ON_HOLD';

export interface EmployeeProfileResponse {
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  systemRole: UserRole;
  status: UserStatus;
  workFormat: UserWorkFormat;
  createdAt: string;

  technologies: {
    id: string;
    name: string;
    type: TechnologyType;
    image: string | null;
    rating: number;
  }[];

  projects: {
    id: string;
    name: string;
    avatarUrl: string | null;
    projectStatus: ProjectStatus;
    projectType: ProjectType;
    userPosition: UserProjectPosition;
    userProjectStatus: UserProjectStatus;
  }[];

  recentTimeLogs: {
    id: string;
    date: string;
    hours: number;
    description: string;
    projectName: string;
  }[];

  recentPtoLogs: {
    id: string;
    date: string;
    hours: number;
  }[];
}
