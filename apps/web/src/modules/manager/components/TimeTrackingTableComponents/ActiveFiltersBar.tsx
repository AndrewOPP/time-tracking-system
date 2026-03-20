import { Users, Briefcase, UserCog, X } from 'lucide-react';
import type { ElementType } from 'react';

interface ActiveFiltersBarProps {
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  onClearCategory: (category: string) => void;
  onClearAll: () => void;
}

interface FilterBadgeProps {
  icon: ElementType;
  label: string;
  count: number;
  paramName: string;
  onClear: (category: string) => void;
}

const FilterBadge = ({ icon: Icon, label, count, paramName, onClear }: FilterBadgeProps) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F4F5] border border-[#E0E1E2] rounded-[6px] text-[14px] text-[#1F1F1F]">
      <Icon className="h-4 w-4 text-[#686868]" />
      <span>
        {label} {count > 0 && `+${count}`}
      </span>
      <button
        onClick={() => onClear(paramName)}
        className="ml-1 hover:text-black text-[#A1A1AA] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ActiveFiltersBar = ({
  selectedEmployees,
  selectedProjects,
  selectedPms,
  onClearCategory,
  onClearAll,
}: ActiveFiltersBarProps) => {
  const totalFiltersCount = selectedEmployees.size + selectedProjects.size + selectedPms.size;

  if (totalFiltersCount === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-4 flex-wrap">
      <FilterBadge
        icon={Users}
        label="Employee"
        count={selectedEmployees.size}
        paramName="employees"
        onClear={onClearCategory}
      />
      <FilterBadge
        icon={Briefcase}
        label="Projects"
        count={selectedProjects.size}
        paramName="projects"
        onClear={onClearCategory}
      />
      <FilterBadge
        icon={UserCog}
        label="PM"
        count={selectedPms.size}
        paramName="pms"
        onClear={onClearCategory}
      />

      <button
        onClick={onClearAll}
        className="text-[14px] text-[#686868] hover:text-[#1F1F1F] px-2 py-1.5 transition-colors"
      >
        Очистити все
      </button>
    </div>
  );
};
