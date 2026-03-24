import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@lib/utils';
import { UniversalFilterPanel } from './filterPanels/UniversalFilterPanel';
import { extractFilterData } from '../../utils/extractFilterData';
import type { FilterItem, ManagerDashboardRow, PanelConfig } from '../../types/managerAIChat.types';
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
    const panelsMap: Record<string, PanelConfig> = {
      [FILTER_CONFIG.employee.cadeAndKey]: {
        items: filtersPanelData.users as FilterItem[],
        selectedIds: selectedEmployees,
        onToggle: toggleEmployee,
        config: FILTER_CONFIG.employee,
      },
      [FILTER_CONFIG.projects.cadeAndKey]: {
        items: filtersPanelData.projects as FilterItem[],
        selectedIds: selectedProjects,
        onToggle: toggleProject,
        config: FILTER_CONFIG.projects,
      },
      [FILTER_CONFIG.pm.cadeAndKey]: {
        items: filtersPanelData.pms as FilterItem[],
        selectedIds: selectedPms,
        onToggle: togglePm,
        config: FILTER_CONFIG.pm,
      },
    };

    const activePanelProps = panelsMap[activeCategory];

    if (activePanelProps) {
      return (
        <UniversalFilterPanel<FilterItem>
          key={activePanelProps.config.cadeAndKey}
          items={activePanelProps.items}
          selectedIds={activePanelProps.selectedIds}
          onToggle={activePanelProps.onToggle}
          idKey={activePanelProps.config.idKey}
          nameKey={activePanelProps.config.nameKey}
          avatarKey={activePanelProps.config.avatarKey}
          searchPlaceholder={activePanelProps.config.placeholder}
          emptyStateText={activePanelProps.config.emptyText}
        />
      );
    }

    return (
      <div
        key="development"
        className="flex-1 flex items-center justify-center text-[14px] text-[#A1A1AA] animate-in fade-in duration-500"
      >
        Filter in development...
      </div>
    );
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
