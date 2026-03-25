import { ProjectTypeValue } from '../constants/timeLogs.constants';

export interface user {
  sub: string;
  email: string;
  role: string;
}

export interface ProjectData {
  projectId: string;
  type: ProjectTypeValue;
  projectName: string;
  projectAvatarUrl: string;
  pmName: string;
  pmAvatarUrl: string | null;
  perProjectTotal: number;
  weeks: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
    week6: number;
  };
}

export interface ManagerDashboardRow {
  userId: string;
  employeeName: string;
  avatarUrl: string | null;
  totalUserHours: number;
  ptoHours: number;
  format: string;
  employedTimePercent: number;
  projects: ProjectData[];
}

export interface CalculatedEmployedTimeData {
  hours: {
    billable: number;
    nonBillable: number;
    untracked: number;
    overtime: number;
  };
  visualPercents: {
    billable: number;
    nonBillable: number;
    untracked: number;
    overtime: number;
  };
  employedTimePercent: number;
  monthWorkingHours: number;
}
