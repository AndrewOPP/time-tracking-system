import { memo } from 'react';
import { flexRender, type ColumnDef, type Row, type Table } from '@tanstack/react-table';
import { Virtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { VirtualTableRow } from './VirtualTableRow';
import type { ManagerDashboardRow } from '../../types/managerAIChat.types';

interface TimeTrackingTableProps {
  table: Table<ManagerDashboardRow>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualRows: VirtualItem[];
  rows: Row<ManagerDashboardRow>[];
  columns: ColumnDef<ManagerDashboardRow>[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
}

export const TimeTrackingTable = memo(
  ({
    table,
    rowVirtualizer,
    virtualRows,
    rows,
    columns,
    containerRef,
    isFetchingNextPage,
  }: TimeTrackingTableProps) => {
    const totalSize = rowVirtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
    const paddingBottom =
      virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;

    return (
      <div
        ref={containerRef}
        className="w-full border border-[#E0E1E2] rounded-md bg-white overflow-auto max-h-[calc(100vh-250px)] relative custom-scrollbar"
      >
        <table className="text-sm text-left border-separate border-spacing-0 table-fixed w-max min-w-full">
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
                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
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
                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
              </tr>
            )}

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
