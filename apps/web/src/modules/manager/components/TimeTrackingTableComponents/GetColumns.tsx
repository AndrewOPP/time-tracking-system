import type { ColumnDef } from '@tanstack/react-table';
import type { ManagerDashboardRow, WeekInfo } from '../../types/managerAIChat.types';

import {
  HeaderEmployee,
  HeaderProjects,
  HeaderWeek,
  HeaderTotal,
  HeaderEmployedTime,
  HeaderPto,
  HeaderPm,
  HeaderFormat,
} from './headers';

import {
  CellEmployee,
  CellProjects,
  CellWeek,
  CellPerProjectTotal,
  CellTotal,
  CellEmployedTime,
  CellPm,
  CellFormat,
} from './cells';

export const getColumns = (weeksInfo: WeekInfo[]): ColumnDef<ManagerDashboardRow>[] => {
  const baseColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'employee',
      accessorKey: 'employeeName',
      header: HeaderEmployee,
      cell: ({ row }) => (
        <CellEmployee
          name={row.original.employeeName}
          username={row.original.username}
          avatarUrl={row.original.avatarUrl}
        />
      ),
    },
    {
      id: 'projects',
      header: HeaderProjects,
      cell: ({ row }) => <CellProjects projects={row.original.projects} />,
    },
  ];

  const weekColumns: ColumnDef<ManagerDashboardRow>[] = weeksInfo.map(week => ({
    id: `week${week.weekNumber}`,
    header: () => <HeaderWeek weekNumber={week.weekNumber} workingHours={week.workingHours} />,
    cell: ({ row }) => <CellWeek projects={row.original.projects} weekNumber={week.weekNumber} />,
  }));

  const tailColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'perProjectTotal',
      header: 'Σ Per Project Total',
      cell: ({ row }) => <CellPerProjectTotal projects={row.original.projects} />,
    },
    {
      id: 'total',
      accessorKey: 'totalUserHours',
      header: HeaderTotal,
      cell: ({ getValue }) => <CellTotal value={Number(getValue())} />,
    },
    {
      id: 'employedTime',
      accessorKey: 'employedTimePercent',
      header: HeaderEmployedTime,
      cell: ({ row }) => {
        const { totalUserHours, eployedPercent } = row.original;

        return (
          <CellEmployedTime employedTimeData={eployedPercent} totalUserHours={totalUserHours} />
        );
      },
    },
    {
      id: 'pto',
      accessorKey: 'ptoHours',
      header: HeaderPto,
      cell: ({ getValue }) => <CellTotal value={Number(getValue())} />,
    },
    {
      id: 'pm',
      header: HeaderPm,
      cell: ({ row }) => <CellPm projects={row.original.projects} />,
    },
    {
      id: 'format',
      accessorKey: 'format',
      header: HeaderFormat,
      cell: ({ getValue }) => <CellFormat format={String(getValue())} />,
    },
  ];

  return [...baseColumns, ...weekColumns, ...tailColumns];
};
