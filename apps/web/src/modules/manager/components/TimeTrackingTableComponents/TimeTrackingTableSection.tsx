import { useRef, memo } from 'react';
import { useTimeTrackingTable } from '../../hooks/useTimeTrackingTable';
import type { ManagerDashboardRow, WeekInfo } from '../../types/managerAIChat.types';
import { TimeTrackingTable } from './TimeTrackingTable';

interface TableSectionProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
}

export const TimeTrackingTableSection = memo(({ data, weeksInfo }: TableSectionProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableLogic = useTimeTrackingTable({
    data,
    weeksInfo,
    containerRef: tableContainerRef,
  });

  return (
    <div className="w-full transition-opacity animate-in fade-in duration-500">
      <TimeTrackingTable {...tableLogic} containerRef={tableContainerRef} />
    </div>
  );
});

TimeTrackingTableSection.displayName = 'TimeTrackingTableSection';
