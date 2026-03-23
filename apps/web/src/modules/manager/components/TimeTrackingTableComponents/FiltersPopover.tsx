import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@lib/utils';
import { UniversalFilterPanel } from './filterPanels/UniversalFilterPanel';
import { extractFilterData } from '../../utils/extractFilterData';
import type {
  FilterItem,
  ManagerDashboardRow,
  PanelConfig,
  WeekInfo,
} from '../../types/managerAIChat.types';
import { CategoryList } from '../CategoryList';
import { CATEGORIES, FILTER_CONFIG, RANGE_MIN_MAX } from '../../constants/constants';
import type { EmploymentFormatValue, RangeType } from '../../constants/constants';
import { UniversalRangeFilterPanel } from './filterPanels/UniversalRangeFilterPanel';
import type { FilterRanges } from '../../hooks/useTableFilters';
import { WorkFormatFilterPanel } from './filterPanels/WorkFormatFilterPanel';

export interface FiltersPopoverProps {
  flatTableData: ManagerDashboardRow[];
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  weeksInfo: WeekInfo[];
  ranges: FilterRanges;
  selectedFormat: EmploymentFormatValue | null;
  toggleEmployee: (id: string) => void;
  toggleProject: (id: string) => void;
  togglePm: (id: string) => void;
  setRangeValue: (baseKey: string, type: RangeType, value: number | null) => void;
  setFormat: (val: EmploymentFormatValue | null) => void;
}

export const FiltersPopover = ({
  weeksInfo,
  flatTableData,
  selectedEmployees,
  selectedProjects,
  selectedPms,
  ranges,
  selectedFormat,
  toggleEmployee,
  toggleProject,
  togglePm,
  setRangeValue,
  setFormat,
}: FiltersPopoverProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(FILTER_CONFIG.employee.caseAndKey);
  const [isOpen, setIsOpen] = useState(false);

  const filtersPanelData = useMemo(() => {
    return extractFilterData(flatTableData);
  }, [flatTableData]);

  const renderRightPanel = () => {
    const universalPanelsMap: Record<string, PanelConfig> = {
      [FILTER_CONFIG.employee.caseAndKey]: {
        items: filtersPanelData.users as FilterItem[],
        selectedIds: selectedEmployees,
        onToggle: toggleEmployee,
        config: FILTER_CONFIG.employee,
      },
      [FILTER_CONFIG.projects.caseAndKey]: {
        items: filtersPanelData.projects as FilterItem[],
        selectedIds: selectedProjects,
        onToggle: toggleProject,
        config: FILTER_CONFIG.projects,
      },
      [FILTER_CONFIG.pm.caseAndKey]: {
        items: filtersPanelData.pms as FilterItem[],
        selectedIds: selectedPms,
        onToggle: togglePm,
        config: FILTER_CONFIG.pm,
      },
    };

    const activeUniversalPanel = universalPanelsMap[activeCategory];

    if (activeUniversalPanel) {
      return (
        <UniversalFilterPanel<FilterItem>
          key={activeUniversalPanel.config.caseAndKey}
          items={activeUniversalPanel.items}
          selectedIds={activeUniversalPanel.selectedIds}
          onToggle={activeUniversalPanel.onToggle}
          idKey={activeUniversalPanel.config.idKey}
          nameKey={activeUniversalPanel.config.nameKey}
          avatarKey={activeUniversalPanel.config.avatarKey}
          searchPlaceholder={activeUniversalPanel.config.placeholder}
          emptyStateText={activeUniversalPanel.config.emptyText}
        />
      );
    }

    if (activeCategory === FILTER_CONFIG.format.caseAndKey) {
      return (
        <WorkFormatFilterPanel
          key={FILTER_CONFIG.format.caseAndKey}
          selectedFormat={selectedFormat}
          setFormat={setFormat}
        />
      );
    }

    const rangeConfig = CATEGORIES.find(category => category.id === activeCategory);

    if (rangeConfig) {
      return (
        <UniversalRangeFilterPanel
          key={rangeConfig.id}
          name={rangeConfig.label}
          selectedMin={ranges[rangeConfig.id]?.min ?? null}
          selectedMax={ranges[rangeConfig.id]?.max ?? null}
          toggleMin={val => setRangeValue(rangeConfig.id, RANGE_MIN_MAX.min, val)}
          toggleMax={val => setRangeValue(rangeConfig.id, RANGE_MIN_MAX.max, val)}
        />
      );
    }

    return null;
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
        <CategoryList
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          weeksInfo={weeksInfo}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-white">{renderRightPanel()}</div>
      </PopoverContent>
    </Popover>
  );
};
