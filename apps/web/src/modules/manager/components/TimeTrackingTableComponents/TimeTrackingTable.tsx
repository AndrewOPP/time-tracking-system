import { useMemo, memo, useRef, useCallback, useEffect } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ManagerDashboardRow, WeekInfo } from '../../hooks/useUsersData';
import { getColumns } from './GetColumns';
import { VirtualTableRow } from './VirtualTableRow';

interface TimeTrackingTableProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const TimeTrackingTable = memo(
  ({ data, weeksInfo, fetchNextPage, hasNextPage, isFetchingNextPage }: TimeTrackingTableProps) => {
    const columns = useMemo(() => getColumns(weeksInfo), [weeksInfo]);

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const estimateSize = useCallback(() => 60, []);

    const rowVirtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => tableContainerRef.current,
      estimateSize,
      overscan: 6,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    useEffect(() => {
      const lastItem = virtualRows[virtualRows.length - 1];
      if (!lastItem) return;

      if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [virtualRows, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
    const paddingBottom =
      virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;

    return (
      <div
        ref={tableContainerRef}
        className="w-full border border-[#E0E1E2] rounded-md bg-white overflow-auto max-h-[calc(100vh-250px)] relative custom-scrollbar"
      >
        <table className="text-sm text-left border-separate border-spacing-0 table-auto w-max min-w-full">
          <thead className="sticky top-0 z-30">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`py-3 px-4 font-medium text-[#6F6F6F] border-b border-r border-[#E0E1E2] last:border-r-0 bg-gray-50
                    ${index === 0 ? 'sticky left-0 z-40' : ''}`}
                  >
                    <div className="min-w-max">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td
                  style={{ height: `${paddingTop}px`, padding: 0, border: 0 }}
                  colSpan={columns.length}
                />
              </tr>
            )}

            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index];
              return (
                <VirtualTableRow
                  key={row.id}
                  row={row}
                  index={virtualRow.index}
                  measureRef={rowVirtualizer.measureElement}
                />
              );
            })}

            {paddingBottom > 0 && (
              <tr>
                <td
                  style={{ height: `${paddingBottom}px`, padding: 0, border: 0 }}
                  colSpan={columns.length}
                />
              </tr>
            )}

            {/* ИНДИКАТОР ЗАГРУЗКИ НОВЫХ СТРОК */}
            {isFetchingNextPage && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 bg-white text-center text-[#6F6F6F] text-sm animate-pulse"
                >
                  Loading more employees...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

TimeTrackingTable.displayName = 'TimeTrackingTable';
