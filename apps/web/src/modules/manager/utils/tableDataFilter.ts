import type { FilterRanges } from '../hooks/useTableFilters';
import type { ManagerDashboardRow } from '../types/managerAIChat.types';
import type { EmploymentFormatValue } from '../constants/constants';
import { findActiveRanges } from './findActiveRanges';
import { checkRangePasses } from './checkRangePasses';

export interface DashboardFilterCriteria {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  ranges: FilterRanges;
  selectedFormat: EmploymentFormatValue | null;
}

const getFilteredProjects = (
  projects: NonNullable<ManagerDashboardRow['projects']>,
  selectedProjects: Set<string>,
  selectedPms: Set<string>,
  hasProjFilter: boolean,
  hasPmFilter: boolean
) => {
  return projects.filter(project => {
    const projectId = String(project.projectId);
    const pmName = project.pmName ? String(project.pmName) : null;

    const matchesProject = !hasProjFilter || selectedProjects.has(projectId);
    const matchesPm = !hasPmFilter || (pmName !== null && selectedPms.has(pmName));

    return matchesProject && matchesPm;
  });
};

export const simpleTableFilter = (
  data: ManagerDashboardRow[],
  criteria: DashboardFilterCriteria
): ManagerDashboardRow[] => {
  if (!data?.length) return [];

  const { selectedEmployees, selectedProjects, selectedPms, ranges, selectedFormat } = criteria;

  const hasEmpFilter = selectedEmployees.size > 0;
  const hasProjFilter = selectedProjects.size > 0;
  const hasPmFilter = selectedPms.size > 0;
  const hasFormatFilter = selectedFormat !== null;

  const activeRanges = findActiveRanges(ranges);
  const hasRangeFilter = activeRanges.length > 0;

  if (!hasEmpFilter && !hasProjFilter && !hasPmFilter && !hasRangeFilter && !hasFormatFilter) {
    return data;
  }

  return data.reduce<ManagerDashboardRow[]>((acc, row) => {
    if (hasFormatFilter && row.format !== selectedFormat) {
      return acc;
    }

    if (hasEmpFilter && !selectedEmployees.has(String(row.employeeName))) {
      return acc;
    }

    const originalProjects = row.projects || [];
    const filteredProjects = getFilteredProjects(
      originalProjects,
      selectedProjects,
      selectedPms,
      hasProjFilter,
      hasPmFilter
    );

    if ((hasProjFilter || hasPmFilter) && filteredProjects.length === 0) {
      return acc;
    }

    if (hasRangeFilter) {
      const passesAllRanges = activeRanges.every(range =>
        checkRangePasses(range, row, filteredProjects)
      );

      if (!passesAllRanges) {
        return acc;
      }
    }

    acc.push({
      ...row,
      allProjects: row.allProjects || originalProjects,
      projects: hasProjFilter || hasPmFilter ? filteredProjects : originalProjects,
    });

    return acc;
  }, []);
};
