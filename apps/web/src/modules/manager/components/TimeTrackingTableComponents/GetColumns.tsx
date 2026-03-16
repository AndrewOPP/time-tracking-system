import type { ColumnDef } from '@tanstack/react-table';
import {
  FileText,
  Calculator,
  Building2,
  CircleUserRound,
  Clock8,
  User,
  Plane,
} from 'lucide-react';
import { CellList } from './CellList';
import { FastUserAvatar } from './FastUserAvatar';
import { FastProjectAvatar } from './FastProjectAvatar';
import type { ManagerDashboardRow, WeekInfo } from '../../types/managerAIChat.types';

export const getColumns = (weeksInfo: WeekInfo[]): ColumnDef<ManagerDashboardRow>[] => {
  const baseColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'employee',
      accessorKey: 'employeeName',
      header: () => (
        <div className="flex items-center gap-1.5 w-57.5">
          <User className="h-4 w-4 shrink-0" />
          Employee
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 px-5 w-[230px]">
          <FastUserAvatar
            src={row.original.avatarUrl || ''}
            name={row.original.employeeName}
            className="h-5 w-5 shrink-0"
          />
          <span
            className="text-[14px] text-[#1F1F1F] font-medium truncate flex-1 w-[20px]"
            title={row.original.employeeName}
          >
            {row.original.employeeName}
          </span>
        </div>
      ),
    },
    {
      id: 'projects',
      header: () => (
        <div className="flex items-center gap-1.5  w-[250px]">
          <FileText className="h-4 w-4 shrink-0" />
          Projects
        </div>
      ),
      cell: ({ row }) => (
        <CellList
          items={row.original.projects}
          renderItem={project => (
            <div className="p-0 flex items-center gap-2  w-full">
              <FastProjectAvatar src={project.projectAvatarUrl || ''} name={project.projectName} />
              <span
                className="text-[#1F1F1F] text-[14px] truncate flex-1 w-[250px]"
                title={project.projectName}
              >
                {project.projectName}
              </span>
            </div>
          )}
        />
      ),
    },
  ];

  const weekColumns: ColumnDef<ManagerDashboardRow>[] = weeksInfo.map(week => ({
    id: `week${week.weekNumber}`,
    header: () => {
      const isFullWeek = week.workingHours >= 40;
      const dotColor = isFullWeek ? 'bg-[#4E916B]' : 'bg-[#F97316]';

      return (
        <div className="flex items-center gap-2 w-[120px]">
          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-[#6F6F6F] font-medium whitespace-nowrap">
            Week {week.weekNumber} [{week.workingHours}h]
          </span>
        </div>
      );
    },
    cell: ({ row }) => (
      <CellList
        items={row.original.projects}
        renderItem={project => {
          const val = Number(project.weeks[`week${week.weekNumber}` as keyof typeof project.weeks]);
          return (
            <div className="flex items-center gap-2 w-full">
              <FastProjectAvatar src={project.projectAvatarUrl || ''} name={project.projectName} />
              <span className="text-[#1F1F1F] text-[14px]">{val === 0 ? '0' : val.toFixed(2)}</span>
            </div>
          );
        }}
      />
    ),
  }));

  const tailColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'perProjectTotal',
      header: 'Σ Per Project Total',
      cell: ({ row }) => (
        <CellList
          items={row.original.projects}
          renderItem={project => (
            <div className="flex flex-row items-center gap-2 w-[130px]">
              <FastProjectAvatar src={project.projectAvatarUrl || ''} name={project.projectName} />
              <span className="text-[#1F1F1F]">
                {Number(project.perProjectTotal) === 0
                  ? '0'
                  : Number(project.perProjectTotal).toFixed(2)}
              </span>
            </div>
          )}
        />
      ),
    },
    {
      id: 'total',
      accessorKey: 'totalUserHours',
      header: () => (
        <div className="flex items-center justify-center gap-1.5 w-[70px]">
          <Calculator className="h-4 w-4 shrink-0" />
          Total
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center justify-end px-4 text-[#1F1F1F]  w-full">
          {Number(getValue())}
        </div>
      ),
    },
    {
      id: 'employedTime',
      accessorKey: 'employedTimePercent',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Clock8 className="h-4 w-4 shrink-0" />
          Employed Time %
        </div>
      ),
      cell: ({ getValue }) => {
        const percent = Number(getValue());
        return (
          <div className="flex items-center px-4 gap-2 w-full">
            <span className="text-sm font-medium w-10 text-[#1F1F1F]">{percent}%</span>
          </div>
        );
      },
    },
    {
      id: 'pto',
      accessorKey: 'ptoHours',
      header: () => (
        <div className="flex items-center justify-end gap-1.5 w-full">
          <Plane className="h-4 w-4 shrink-0" />
          PTO Hours
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="flex items-center justify-end px-4 text-[#1F1F1F] w-full">
          {Number(getValue())}
        </div>
      ),
    },
    {
      id: 'pm',
      header: () => (
        <div className="flex items-center gap-1.5 ">
          <CircleUserRound className="h-4 w-4 shrink-0" />
          PM
        </div>
      ),
      cell: ({ row }) => (
        <CellList
          items={row.original.projects}
          renderItem={project => (
            <div className="flex items-center gap-2">
              <FastUserAvatar
                src={project.pmAvatarUrl || ''}
                name={project.pmName || 'PM'}
                className="h-4 w-4 shrink-0"
              />
              <span className="text-[14px] text-[#1F1F1F] truncate flex-1" title={project.pmName}>
                {project.pmName}
              </span>
            </div>
          )}
        />
      ),
    },
    {
      id: 'format',
      accessorKey: 'format',
      header: () => (
        <div className="flex items-center justify-center gap-1.5 w-full">
          <Building2 className="h-4 w-4 shrink-0" />
          Format
        </div>
      ),
      cell: ({ getValue }) => {
        const val = String(getValue());
        return (
          <div className="flex items-center justify-center px-4 text-[#1F1F1F] w-full">
            {val === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
          </div>
        );
      },
    },
  ];

  return [...baseColumns, ...weekColumns, ...tailColumns];
};
