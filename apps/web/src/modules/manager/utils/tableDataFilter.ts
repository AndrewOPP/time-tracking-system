import type { FilterRanges } from '../hooks/useTableFilters';
import type { ManagerDashboardRow } from '../types/managerAIChat.types';
import type { EmploymentFormatValue } from '../constants/constants';

export interface DashboardFilterCriteria {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  ranges: FilterRanges;
  selectedFormat: EmploymentFormatValue | null;
}

const isInRange = (value: number, min: number | null, max: number | null) => {
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
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

  const activeRanges = Object.values(ranges).filter(
    range => range.min !== null || range.max !== null
  );

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

    if (hasRangeFilter) {
      const passesAllRanges = activeRanges.every(range => {
        let valueToCheck = 0;

        switch (range.id) {
          case 'total':
            valueToCheck = row.totalUserHours;
            break;
          case 'pto':
            valueToCheck = row.ptoHours;
            break;
          case 'employedPercent':
            valueToCheck = row.eployedPercent.employedTimePercent;

            break;
          case 'week1':
          case 'week2':
          case 'week3':
          case 'week4':
          case 'week5':
          case 'week6':
            valueToCheck = filteredProjects.reduce((sum, p) => {
              const weekHours = p.weeks[range.id as keyof typeof p.weeks] || 0;
              return sum + weekHours;
            }, 0);
            break;
          default:
            return true;
        }

        return isInRange(valueToCheck, range.min, range.max);
      });

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
