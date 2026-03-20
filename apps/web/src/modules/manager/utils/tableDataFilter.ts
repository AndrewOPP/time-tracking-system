import type { ManagerDashboardRow } from '../types/managerAIChat.types';

export interface DashboardFilterCriteria {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
}

export const tableDataFilter = (
  data: ManagerDashboardRow[],
  { selectedEmployees, selectedProjects, selectedPms }: DashboardFilterCriteria
): ManagerDashboardRow[] => {
  if (!data?.length) return [];

  return data.filter(row => {
    const matchesEmployee = selectedEmployees.size === 0 || selectedEmployees.has(row.employeeName);

    const matchesProject =
      selectedProjects.size === 0 ||
      (Array.isArray(row.projects) &&
        row.projects.some(project => selectedProjects.has(project.projectId)));

    const matchesPm =
      selectedPms.size === 0 ||
      (Array.isArray(row.projects) &&
        row.projects.some(project => project.pmName && selectedPms.has(project.pmName)));

    return matchesEmployee && matchesProject && matchesPm;
  });
};
