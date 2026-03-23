import { Users, Briefcase, UserCog } from 'lucide-react';
import { FilterBadge } from './FilterBadge';
import type { FilterRanges } from '../../hooks/useTableFilters';
import type { EmploymentFormatValue } from '../../constants/constants';

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
  const totalFiltersCount = selectedEmployees.size + selectedProjects.size + selectedPms.size;

  if (totalFiltersCount === 0) return null;

  const FILTERS_BADGE = [
    {
      icon: Users,
      label: 'Employee',
      count: selectedEmployees.size,
      paramName: 'employees',
      isActive: selectedEmployees.size > 0,
    },
    {
      icon: Briefcase,
      label: 'Projects',
      count: selectedProjects.size,
      paramName: 'projects',
      isActive: selectedProjects.size > 0,
    },
    {
      icon: UserCog,
      label: 'PM',
      count: selectedPms.size,
      paramName: 'pms',
      isActive: selectedPms.size > 0,
    },
    {
      icon: UserCog,
      label: 'Format',
      paramName: 'format',
      isActive: !!selectedFormat,
    },
    // { icon: UserCog, label: 'PM', count: selectedPms.size, paramName: 'pms' },
    // { icon: UserCog, label: 'PM', count: selectedPms.size, paramName: 'pms' },
  ];
  console.log(!!selectedFormat, '!!selectedFormat');
  console.log(ranges, 'ranges');

  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      {FILTERS_BADGE.map(filter => (
        <FilterBadge
          isActive={filter.isActive}
          key={filter.paramName}
          icon={filter.icon}
          label={filter.label}
          count={filter.count}
          paramName={filter.paramName}
          onClear={onClearCategory}
        />
      ))}

      <button
        onClick={onClearAll}
        className="text-[14px] text-[#1F1F1F]  px-2 py-1.5 transition-colors cursor-pointer rounded-[8px] hover:bg-[#F7F7F7]"
      >
        Clean all
      </button>
    </div>
  );
};
