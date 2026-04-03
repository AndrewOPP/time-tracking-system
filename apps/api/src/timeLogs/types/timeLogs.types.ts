import { ProjectTypeValue } from '../constants/timeLogs.constants';
import { WeekBoundary } from '../utils/monthToWeeks';

export interface user {
  sub: string;
  email: string;
  role: string;
}

export interface ProjectData {
  projectId: string;
  type: ProjectTypeValue;
  projectName: string;
  domain?: string;
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

  aiChatVisualPercents: {
    billable: number;
    nonBillable: number;
    untracked: number;
    overtime: number;
  };
  tooltip: {
    hours: {
      billable: number;
      nonBillable: number;
      overtime: number;
      untracked: number;
    };
    percents: {
      billable: number;
      nonBillable: number;
      overtime: number;
      total: number;
      untracked: number;
    };
  };
  employedTimePercent: number;
  monthWorkingHours: number;
  totalUserHours: number;
}

export type WorkFormat = 'FULL_TIME' | 'PART_TIME';

export interface CalculatorInput {
  totalUserHours: number;
  weeksInfo: WeekBoundary[];
  projects: ProjectData[];
  workFormat?: WorkFormat;
}
