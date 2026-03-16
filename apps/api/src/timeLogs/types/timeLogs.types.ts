export interface user {
  sub: string;
  email: string;
  role: string;
}

export interface ProjectData {
  projectId: string;
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
