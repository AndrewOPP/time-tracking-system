import type { ManagerDashboardRow } from '../types/managerAIChat.types';

export const calculateTotalWeekHours = (
  projects: ManagerDashboardRow['projects'],
  weekNumber: number
): number => {
  if (!projects) return 0;

  const total = projects.reduce((sum, project) => {
    const val = Number(project.weeks[`week${weekNumber}` as keyof typeof project.weeks]) || 0;
    return sum + val;
  }, 0);

  return Math.floor(total);
};
