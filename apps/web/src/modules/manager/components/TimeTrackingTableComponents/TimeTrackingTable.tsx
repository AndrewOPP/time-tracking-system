import { useMemo } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import type { ManagerDashboardRow, WeekInfo } from '../../hooks/useUsersData';
import { getColumns } from './GetColumns';

const MERGED_COLUMNS = ['employee', 'total', 'employedTime', 'pto', 'format'];

interface TimeTrackingTableProps {
  data: ManagerDashboardRow[];
  weeksInfo: WeekInfo[];
}

export const TimeTrackingTable = ({ data, weeksInfo }: TimeTrackingTableProps) => {
  const columns = useMemo(() => getColumns(weeksInfo), [weeksInfo]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log(data, 'data');

  return (
    <div
      className="
  rounded-md border border-[#E0E1E2] bg-white overflow-auto max-h-[686px]
  
  /* Стили для Chrome, Safari и Edge */
  [&::-webkit-scrollbar]:w-2           
  [&::-webkit-scrollbar]:h-2         
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-[#e4e4e4] 
  [&::-webkit-scrollbar-thumb]:rounded-full  
  [&::-webkit-scrollbar-thumb]:hover:bg-[#e4e4e4] 
  
  /* Стили для Firefox */
  [scrollbar-width:thin] 
  [scrollbar-color:#e4e4e4_transparent]
"
    >
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-[#E0E1E2]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`py-3 px-4 font-medium text-[#6F6F6F] border-[#E0E1E2] last:border-r-0 sticky top-0 bg-gray-50 ${
                    header.column.id === 'employee'
                      ? 'left-0 z-30 shadow-[inset_-1px_0_0_0_#E0E1E2]'
                      : 'z-20 border-r'
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, index, rowsArray) => {
            const { isFirstRowForUser, userTotalProjects, userId } = row.original;

            const isLastRowForUser =
              index === rowsArray.length - 1 || rowsArray[index + 1].original.userId !== userId;

            const ptClass = isFirstRowForUser ? 'pt-3' : 'pt-1.5';
            const pbClass = isLastRowForUser ? 'pb-3' : 'pb-1.5';

            const normalCellPadding = `px-4 ${ptClass} ${pbClass}`;

            return (
              <tr
                key={row.id}
                className={`hover:bg-slate-50/50 transition-colors ${
                  isFirstRowForUser ? 'border-t border-[#E0E1E2]' : ''
                }`}
              >
                {row.getVisibleCells().map(cell => {
                  const isMergedColumn = MERGED_COLUMNS.includes(cell.column.id);

                  if (isMergedColumn) {
                    if (isFirstRowForUser) {
                      return (
                        <td
                          key={cell.id}
                          rowSpan={userTotalProjects}
                          className={`px-4 py-3 align-middle relative border-[#E0E1E2] ${
                            cell.column.id === 'employee'
                              ? 'sticky left-0 z-10 bg-white shadow-[inset_-1px_0_0_0_#E0E1E2]'
                              : 'bg-white border-r'
                          } ${cell.column.id === 'format' ? 'border-l border-r-0' : ''}`}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    } else {
                      return null;
                    }
                  }

                  return (
                    <td
                      key={cell.id}
                      className={`${normalCellPadding} border-r border-[#E0E1E2] last:border-r-0`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
