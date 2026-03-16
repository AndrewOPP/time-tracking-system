import { useMemo, useRef, useEffect } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getColumns } from '../components/TimeTrackingTableComponents/GetColumns';
import type { ManagerDashboardRow, WeekInfo } from '../types/managerAIChat.types';

interface UseTimeTrackingTableProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useTimeTrackingTable = ({
  data,
  weeksInfo,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  containerRef,
}: UseTimeTrackingTableProps) => {
  const columns = useMemo(() => getColumns(weeksInfo), [weeksInfo]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 30,
    overscan: 7,
  });

  const fetchingLock = useRef(false);

  useEffect(() => {
    fetchingLock.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1];

    if (!lastItem || !hasNextPage || fetchingLock.current || rowVirtualizer.scrollOffset === 0)
      return;

    if (lastItem.index >= rows.length - 1) {
      fetchingLock.current = true;
      fetchNextPage();
    }
  }, [virtualRows, rows.length, hasNextPage, fetchNextPage, rowVirtualizer.scrollOffset]);

  return {
    table,
    rowVirtualizer,
    virtualRows,
    rows,
    columns,
  };
};
