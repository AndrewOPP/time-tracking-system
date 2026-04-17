import { axiosPrivate } from '@/shared/api';

export interface DashboardKpis {
  totalTrackedHours: number;
  activeEmployeesCount: number;
  availableEmployeesCount: number;
  overloadedEmployeesCount: number;
  activeProjectsCount: number;
  averageTeamLoad: number;
  partTimeCount: number;
  averagePtoHours: number;
  capacityGap: number;
}

export interface DashboardEmployee {
  id: string;
  name: string;
  workFormat: string;
  ptoHours?: number;
  avatarUrl: string;
  username: string;
  activeProjectsCount?: number;
  loadPercent: number;
}

export interface DashboardTopProject {
  id: string;
  name: string;

  membersCount: number;
  totalHours: number;
}

export interface ManagerDashboardOverviewResponse {
  kpis: DashboardKpis;
  mostAvailableEmployees: DashboardEmployee[];
  highestLoadEmployees: DashboardEmployee[];
  topProjects: DashboardTopProject[];
}

export const getManagerDashboardOverview = async (): Promise<ManagerDashboardOverviewResponse> => {
  const { data } = await axiosPrivate.get<ManagerDashboardOverviewResponse>(
    '/manager-dashboard/overview'
  );
  return data;
};
