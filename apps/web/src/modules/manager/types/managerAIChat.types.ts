import type { UIMessage } from 'ai';

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

export interface WeekInfo {
  weekNumber: number;
  startDate: string;
  endDate: string;
  workingHours: number;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
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
  format: 'FULL_TIME' | 'PART_TIME';
  employedTimePercent: number;
  projects: ProjectData[];
}

export interface ManagerDashboardResponse {
  weeksInfo: WeekInfo[];
  tableData: ManagerDashboardRow[];
  nextPage: number | null;
  totalCount: number;
}
