import { useMemo } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getColumns } from '../components/TimeTrackingTableComponents/GetColumns';
import type { ManagerDashboardRow, WeekInfo } from '../types/managerAIChat.types';

interface UseTimeTrackingTableProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const VIRTUALIZER_CONFIG = {
  estimateSize: 72,
  overscan: 10,
};

export const useTimeTrackingTable = ({
  data,
  weeksInfo,
  containerRef,
}: UseTimeTrackingTableProps) => {
  const columns = useMemo(() => getColumns(weeksInfo), [weeksInfo]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.employeeName,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => VIRTUALIZER_CONFIG.estimateSize,
    overscan: VIRTUALIZER_CONFIG.overscan,
  });

  return {
    table,
    rowVirtualizer,
    virtualRows: rowVirtualizer.getVirtualItems(),
    rows,
    columns,
  };
};
