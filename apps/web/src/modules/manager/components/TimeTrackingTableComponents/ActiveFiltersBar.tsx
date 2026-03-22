import { Users, Briefcase, UserCog } from 'lucide-react';
import { FilterBadge } from './FilterBadge';

interface ActiveFiltersBarProps {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  onClearCategory: (category: string) => void;
  onClearAll: () => void;
}

export const ActiveFiltersBar = ({
  selectedEmployees,
  selectedProjects,
  selectedPms,
  onClearCategory,
  onClearAll,
}: ActiveFiltersBarProps) => {
  const totalFiltersCount = selectedEmployees.size + selectedProjects.size + selectedPms.size;

  if (totalFiltersCount === 0) return null;

  const FILTERS_BADGES = [
    { icon: Users, label: 'Employee', count: selectedEmployees.size, paramName: 'employees' },
    { icon: Briefcase, label: 'Projects', count: selectedProjects.size, paramName: 'projects' },
    { icon: UserCog, label: 'PM', count: selectedPms.size, paramName: 'pms' },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      {FILTERS_BADGES.map(filter => (
        <FilterBadge
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
