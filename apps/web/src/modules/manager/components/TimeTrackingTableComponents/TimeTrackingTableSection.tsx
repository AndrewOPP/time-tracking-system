import { useRef, memo } from 'react';
import { useTimeTrackingTable } from '../../hooks/useTimeTrackingTable';
import type { ManagerDashboardRow, WeekInfo } from '../../types/managerAIChat.types';
import { TimeTrackingTable } from './TimeTrackingTable';

interface TableSectionProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const TimeTrackingTableSection = memo(
  ({ data, weeksInfo, fetchNextPage, hasNextPage, isFetchingNextPage }: TableSectionProps) => {
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const tableLogic = useTimeTrackingTable({
      data,
      weeksInfo,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      containerRef: tableContainerRef,
    });

    return (
      <div className="w-full transition-opacity animate-in fade-in duration-500">
        <TimeTrackingTable
          {...tableLogic}
          containerRef={tableContainerRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    );
  }
);

TimeTrackingTableSection.displayName = 'TimeTrackingTableSection';
