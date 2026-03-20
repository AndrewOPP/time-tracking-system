import { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Users,
  Briefcase,
  Calculator,
  Clock,
  CalendarOff,
  UserCog,
  MonitorSmartphone,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@lib/utils';
import { UniversalFilterPanel } from './filterPanels/UniversalFilterPanel';
import { extractFilterData } from '../../utils/extractFilterData';
import type { ManagerDashboardRow } from '../../types/managerAIChat.types';

export interface FiltersPopoverProps {
  flatTableData: ManagerDashboardRow[];
  selectedEmployees: Set<string>;
  selectedProjects: Set<string>;
  selectedPms: Set<string>;
  toggleEmployee: (id: string) => void;
  toggleProject: (id: string) => void;
  togglePm: (id: string) => void;
}

const CATEGORIES = [
  { id: 'employee', label: 'Employee', icon: Users },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'week1', label: 'Week 1', icon: null, dotColor: '#FF6B6B' },
  { id: 'week2', label: 'Week 2', icon: null, dotColor: '#4ECDC4' },
  { id: 'week3', label: 'Week 3', icon: null, dotColor: '#45B7D1' },
  { id: 'week4', label: 'Week 4', icon: null, dotColor: '#96CEB4' },
  { id: 'week5', label: 'Week 5', icon: null, dotColor: '#FFEEAD' },
  { id: 'total', label: 'Total', icon: Calculator },
  { id: 'employedTime', label: 'Employed Time %', icon: Clock },
  { id: 'pto', label: 'PTO Hours', icon: CalendarOff },
  { id: 'pm', label: 'PM', icon: UserCog },
  { id: 'format', label: 'Format', icon: MonitorSmartphone },
];

export const FiltersPopover = ({
  flatTableData,
  selectedEmployees,
  selectedProjects,
  selectedPms,
  toggleEmployee,
  toggleProject,
  togglePm,
}: FiltersPopoverProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('employee');
  const [isOpen, setIsOpen] = useState(false);

  const filtersPanelData = useMemo(() => {
    return extractFilterData(flatTableData);
  }, [flatTableData]);

  const renderRightPanel = () => {
    switch (activeCategory) {
      case 'employee':
        return (
          <UniversalFilterPanel
            items={filtersPanelData.users}
            selectedIds={selectedEmployees}
            onToggle={toggleEmployee}
            idKey="employeeName"
            nameKey="employeeName"
            avatarKey="avatarUrl"
            searchPlaceholder="Search employee"
            emptyStateText="No employees found"
          />
        );
      case 'projects':
        return (
          <UniversalFilterPanel
            items={filtersPanelData.projects}
            selectedIds={selectedProjects}
            onToggle={toggleProject}
            idKey="projectId"
            nameKey="projectName"
            avatarKey="projectAvatarUrl"
            searchPlaceholder="Search project"
            emptyStateText="No projects found"
          />
        );
      case 'pm':
        return (
          <UniversalFilterPanel
            items={filtersPanelData.pms}
            selectedIds={selectedPms}
            onToggle={togglePm}
            idKey="pmName"
            nameKey="pmName"
            avatarKey="pmAvatarUrl"
            searchPlaceholder="Search manager"
            emptyStateText="No managers found"
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-[14px] text-[#A1A1AA]">
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
        className="flex-row w-[480px] pr-3 pl-2 py-0 flex h-[476px] rounded-xl overflow-hidden shadow-lg border-[#E0E1E2] bg-white p-0"
        align="start"
      >
        <div className="w-[180px] shrink-0 border-r border-[#E0E1E2] overflow-y-auto flex flex-col py-3 px-2 gap-[2px] custom-scrollbar">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'w-full flex items-center gap-[12px] text-[14px] text-left transition-colors py-2 px-3 rounded-[6px] h-[36px]',
                  isActive
                    ? 'bg-[#F4F4F5] font-medium text-[#1F1F1F]'
                    : 'text-[#686868] hover:bg-[#F4F4F5]/50'
                )}
              >
                {Icon ? (
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-[#1F1F1F]' : 'text-[#A1A1AA]'
                    )}
                  />
                ) : (
                  <div
                    className="h-[8px] w-[8px] rounded-full shrink-0"
                    style={{ backgroundColor: cat.dotColor || 'transparent' }}
                  />
                )}
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-white">{renderRightPanel()}</div>
      </PopoverContent>
    </Popover>
  );
};
