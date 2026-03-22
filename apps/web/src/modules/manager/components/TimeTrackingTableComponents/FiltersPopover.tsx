import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@lib/utils';
import { UniversalFilterPanel } from './filterPanels/UniversalFilterPanel';
import { extractFilterData } from '../../utils/extractFilterData';
import type { ManagerDashboardRow } from '../../types/managerAIChat.types';
import { CategoryList } from '../CategoryList';
import { FILTER_CONFIG } from '../../constants/constants';

export interface FiltersPopoverProps {
  flatTableData: ManagerDashboardRow[];
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  toggleEmployee: (id: string) => void;
  toggleProject: (id: string) => void;
  togglePm: (id: string) => void;
}

export const FiltersPopover = ({
  flatTableData,
  selectedEmployees,
  selectedProjects,
  selectedPms,
  toggleEmployee,
  toggleProject,
  togglePm,
}: FiltersPopoverProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(FILTER_CONFIG.employee.cadeAndKey);
  const [isOpen, setIsOpen] = useState(false);

  const filtersPanelData = useMemo(() => {
    return extractFilterData(flatTableData);
  }, [flatTableData]);

  const renderRightPanel = () => {
    switch (activeCategory) {
      case FILTER_CONFIG.employee.cadeAndKey:
        return (
          <UniversalFilterPanel
            key={FILTER_CONFIG.employee.cadeAndKey}
            items={filtersPanelData.users}
            selectedIds={selectedEmployees}
            onToggle={toggleEmployee}
            idKey={FILTER_CONFIG.employee.idKey}
            nameKey={FILTER_CONFIG.employee.nameKey}
            avatarKey={FILTER_CONFIG.employee.avatarKey}
            searchPlaceholder={FILTER_CONFIG.employee.placeholder}
            emptyStateText={FILTER_CONFIG.employee.emptyText}
          />
        );
      case FILTER_CONFIG.projects.cadeAndKey:
        return (
          <UniversalFilterPanel
            key={FILTER_CONFIG.projects.cadeAndKey}
            items={filtersPanelData.projects}
            selectedIds={selectedProjects}
            onToggle={toggleProject}
            idKey={FILTER_CONFIG.projects.idKey}
            nameKey={FILTER_CONFIG.projects.nameKey}
            avatarKey={FILTER_CONFIG.projects.avatarKey}
            searchPlaceholder={FILTER_CONFIG.projects.placeholder}
            emptyStateText={FILTER_CONFIG.projects.emptyText}
          />
        );
      case FILTER_CONFIG.pm.cadeAndKey:
        return (
          <UniversalFilterPanel
            key={FILTER_CONFIG.pm.cadeAndKey}
            items={filtersPanelData.pms}
            selectedIds={selectedPms}
            onToggle={togglePm}
            idKey={FILTER_CONFIG.pm.idKey}
            nameKey={FILTER_CONFIG.pm.nameKey}
            avatarKey={FILTER_CONFIG.pm.avatarKey}
            searchPlaceholder={FILTER_CONFIG.pm.placeholder}
            emptyStateText={FILTER_CONFIG.pm.emptyText}
          />
        );
      default:
        return (
          <div
            key="development"
            className="flex-1 flex items-center justify-center text-[14px] text-[#A1A1AA] animate-in fade-in duration-500"
          >
            Filter in development...
          </div>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'h-10 w-10 border border-[#E0E1E2] flex items-center justify-center rounded-[6px] shrink-0 bg-white cursor-pointer hover:bg-gray-50 transition-colors',
            isOpen && 'bg-gray-100'
          )}
        >
          <SlidersHorizontal className="h-4 w-4 text-[#1F1F1F]" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="flex-row w-[480px] pr-3 pl-2 py-0 flex gap-0 h-[476px] rounded-xl overflow-hidden shadow-lg border-[#E0E1E2] bg-white p-0"
        align="start"
      >
        <CategoryList activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <div className="flex-1 flex flex-col min-w-0 bg-white">{renderRightPanel()}</div>
      </PopoverContent>
    </Popover>
  );
};
