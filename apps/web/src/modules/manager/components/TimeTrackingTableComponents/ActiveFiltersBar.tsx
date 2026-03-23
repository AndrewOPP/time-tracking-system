import { Users, Briefcase, UserCog } from 'lucide-react';
import { FilterBadge } from './FilterBadge';

const FILTER_CONFIG = [
  { icon: Users, label: 'Employee', paramName: 'employees' },
  { icon: Briefcase, label: 'Projects', paramName: 'projects' },
  { icon: UserCog, label: 'PM', paramName: 'pms' },
] as const;

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

  const countsMap = {
    employees: selectedEmployees.size,
    projects: selectedProjects.size,
    pms: selectedPms.size,
  };

  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      {FILTER_CONFIG.map(filter => (
        <FilterBadge
          key={filter.paramName}
          icon={filter.icon}
          label={filter.label}
          count={countsMap[filter.paramName]}
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
