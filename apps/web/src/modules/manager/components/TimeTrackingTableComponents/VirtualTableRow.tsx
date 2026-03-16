import { memo } from 'react';

import { flexRender, type Row } from '@tanstack/react-table';
import type { ManagerDashboardRow } from '../../types/managerAIChat.types';

export const VirtualTableRow = memo(
  ({
    row,
    index,
    measureRef,
  }: {
    row: Row<ManagerDashboardRow>;
    index: number;
    measureRef: (node: Element | null) => void;
  }) => (
    <tr ref={measureRef} data-index={index} className="hover:bg-slate-50/50 transition-colors">
      {row.getVisibleCells().map((cell, cellIndex) => (
        <td
          key={cell.id}
          className={`align-middle border-b border-r border-[#E0E1E2] last:border-r-0 bg-white
        ${cellIndex === 0 ? 'sticky left-0 z-10' : ''}`}
        >
          <div className="">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
        </td>
      ))}
    </tr>
  ),
  (prevProps, nextProps) => {
    return prevProps.row.id === nextProps.row.id && prevProps.index === nextProps.index;
  }
);
