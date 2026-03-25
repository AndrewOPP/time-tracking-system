import type { UIMessage } from 'ai';
import type { EmploymentFormatValue, ProjectTypeValue } from '../constants/constants';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatStore {
  savedMessages: UIMessage[];
  setSavedMessages: (messages: UIMessage[]) => void;
  clearMessages: () => void;
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

export interface WeekInfo {
  weekNumber: number;
  startDate: string;
  endDate: string;
  workingHours: number;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  type: ProjectTypeValue;
  pmName: string;
  projectAvatarUrl: string;
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
  eployedPercent: CalculatedEmployedTimeData;
  format: EmploymentFormatValue;
  allProjects: ProjectData[];
  projects: ProjectData[];
}

export interface ManagerDashboardResponse {
  weeksInfo: WeekInfo[];
  tableData: ManagerDashboardRow[];
  nextPage: number | null;
  totalCount: number;
}

export type FilterItem = Record<string, string | null>;

export interface PanelConfig {
  items: FilterItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  config: {
    caseAndKey: string;
    idKey: string;
    nameKey: string;
    avatarKey?: string;
    placeholder: string;
    emptyText: string;
  };
}
