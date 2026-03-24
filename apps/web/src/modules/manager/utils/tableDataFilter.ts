import type { ManagerDashboardRow } from '../types/managerAIChat.types';

export interface DashboardFilterCriteria {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
}

export const simpleTableFilter = (
  data: ManagerDashboardRow[],
  criteria: DashboardFilterCriteria
): ManagerDashboardRow[] => {
  if (!data?.length) return [];

  const { selectedEmployees, selectedProjects, selectedPms } = criteria;

  const hasEmpFilter = selectedEmployees.size > 0;
  const hasProjFilter = selectedProjects.size > 0;
  const hasPmFilter = selectedPms.size > 0;

  if (!hasEmpFilter && !hasProjFilter && !hasPmFilter) {
    return data;
  }

  return data.reduce<ManagerDashboardRow[]>((acc, row) => {
    if (hasEmpFilter && !selectedEmployees.has(String(row.employeeName))) {
      return acc;
    }

    const originalProjects = row.projects || [];

    const filteredProjects = originalProjects.filter(project => {
      const projectId = String(project.projectId);
      const pmName = project.pmName ? String(project.pmName) : null;

      const matchesProject = !hasProjFilter || selectedProjects.has(projectId);
      const matchesPm = !hasPmFilter || (pmName !== null && selectedPms.has(pmName));

      return matchesProject && matchesPm;
    });

    if ((hasProjFilter || hasPmFilter) && filteredProjects.length === 0) {
      return acc;
    }

    acc.push({
      ...row,
      allProjects: row.projects,
      projects: hasProjFilter || hasPmFilter ? filteredProjects : originalProjects,
    });

    return acc;
  }, []);
};
