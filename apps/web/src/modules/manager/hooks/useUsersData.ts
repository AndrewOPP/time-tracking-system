import { useQuery } from '@tanstack/react-query';

import { getUsersInfo } from '../api/timeTrackingTable.api';

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
  format: 'FULL_TIME' | 'PART_TIME' | string;
  employedTimePercent: number;
  projects: ProjectData[];
}

export interface ManagerDashboardResponse {
  weeksInfo: WeekInfo[];
  tableData: ManagerDashboardRow[];
}
export const useUsersData = (from: string, to: string, search?: string) => {
  return useQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: () => getUsersInfo({ from, to, search }),
    staleTime: 1000 * 60 * 5,
  });
};
