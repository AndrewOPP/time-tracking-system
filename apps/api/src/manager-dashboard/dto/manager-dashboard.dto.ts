export class ManagerDashboardOverviewResponse {
  kpis: {
    totalTrackedHours: number;
    activeEmployeesCount: number;
    availableEmployeesCount: number;
    overloadedEmployeesCount: number;
    activeProjectsCount: number;
    averageTeamLoad: number;
    partTimeCount: number;
    averagePtoHours: number;
    capacityGap: number;
  };
  mostAvailableEmployees: Array<{
    id: string;
    name: string;
    workFormat: string;
    username: string;
    ptoHours: number;
    avatarUrl: string;
    loadPercent: number;
  }>;
  highestLoadEmployees: Array<{
    id: string;
    name: string;
    workFormat: string;
    username: string;
    avatarUrl: string;
    activeProjectsCount: number;
    loadPercent: number;
  }>;
  topProjects: Array<{
    id: string;
    name: string;
    membersCount: number;
    totalHours: number;
  }>;
}
