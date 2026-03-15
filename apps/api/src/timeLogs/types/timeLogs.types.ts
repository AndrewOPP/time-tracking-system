export interface user {
  sub: string;
  email: string;
  role: string;
}

export interface ManagerDashboardRow {
  userId: string;
  employeeName: string;
  avatarUrl: string | null;
  isFirstRowForUser: boolean;
  userTotalProjects: number;
  totalUserHours: number;
  ptoHours: number;
  format: string;
  employedTimePercent: number;

  projectId: string;
  projectName: string;
  pmName: string;
  projectAvatarUrl: string;
  pmAvatarUrl: string | null;
  perProjectTotal: number;

  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
}
