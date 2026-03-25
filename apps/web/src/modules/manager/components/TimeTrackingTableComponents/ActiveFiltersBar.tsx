import { FilterBadge } from './FilterBadge';
import type { FilterRanges } from '../../hooks/useTableFilters';
import { CATEGORIES, type EmploymentFormatValue } from '../../constants/constants';
import { findActiveRanges } from '../../utils/findActiveRanges';

interface ActiveFiltersBarProps {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  onClearCategory: (category: string) => void;
  onClearAll: () => void;
  ranges: FilterRanges;
  selectedFormat: EmploymentFormatValue | null;
}

export const ActiveFiltersBar = ({
  ranges,
  selectedFormat,
  selectedEmployees,
  selectedProjects,
  selectedPms,
  onClearCategory,
  onClearAll,
}: ActiveFiltersBarProps) => {
  const activeRanges = findActiveRanges(ranges);

  const range_filters_badges = activeRanges.reduce(
    (acc, { min, max, id }) => {
      acc[id] = { isActive: !!min || !!max, count: 0 };
      return acc;
    },
    {} as Record<string, { isActive: boolean; count: number }>
  );

  const badgesMap: Record<string, { count: number; isActive: boolean }> = {
    employees: { count: selectedEmployees.size, isActive: selectedEmployees.size > 0 },
    projects: { count: selectedProjects.size, isActive: selectedProjects.size > 0 },
    pms: { count: selectedPms.size, isActive: selectedPms.size > 0 },
    format: { count: 0, isActive: !!selectedFormat },
    ...range_filters_badges,
  };

  const hasActiveFilters = Object.values(badgesMap).some(filter => filter.isActive);
  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      {CATEGORIES.map(filter => {
        const filterState = badgesMap[filter.id];

        if (!filterState?.isActive) return null;

        return (
          <FilterBadge
            key={filter.id}
            icon={filter.icon}
            label={filter.label}
            count={filterState.count}
            paramName={filter.id}
            onClear={onClearCategory}
          />
        );
      })}

      <button
        onClick={onClearAll}
        className="text-[14px] text-[#1F1F1F]  px-2 py-1.5 transition-colors cursor-pointer rounded-[8px] hover:bg-[#F7F7F7]"
      >
        Clean all
      </button>
    </div>
  );
};
