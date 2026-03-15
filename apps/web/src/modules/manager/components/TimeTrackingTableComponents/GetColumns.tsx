import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import type { ManagerDashboardRow, WeekInfo } from '../../hooks/useUsersData';
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

export const getColumns = (weeksInfo: WeekInfo[]): ColumnDef<ManagerDashboardRow>[] => {
  const baseColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'employee',
      accessorKey: 'employeeName',
      header: () => (
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          Employee
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={row.original.avatarUrl || ''} alt={row.original.employeeName} />
            <AvatarFallback>{row.original.employeeName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-[14px] text-[#1F1F1F]">{row.original.employeeName}</span>
        </div>
      ),
    },
    {
      id: 'projects',
      accessorKey: 'projectName',
      header: () => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          Projects
        </div>
      ),
      cell: ({ row }) => {
        const projectAvatarUrl = row.original.projectAvatarUrl;
        const projectName = row.original.projectName;

        return (
          <div className="flex items-center gap-2  ">
            <img
              src={projectAvatarUrl}
              alt={projectName}
              className="h-4 w-4 rounded  object-cover shrink-0 "
            />
            <span className="text-[#1F1F1F] text-[14px]">{projectName}</span>
          </div>
        );
      },
    },
  ];

  const weekColumns: ColumnDef<ManagerDashboardRow>[] = weeksInfo.map(week => ({
    id: `week${week.weekNumber}`,
    accessorKey: `week${week.weekNumber}` as keyof ManagerDashboardRow,
    header: () => {
      const isFullWeek = week.workingHours >= 40;
      const dotColor = isFullWeek ? 'bg-[#4E916B]' : 'bg-[#F97316]';

      return (
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
          <span className="text-[#6F6F6F] font-medium">
            Week {week.weekNumber} [{week.workingHours}h]
          </span>
        </div>
      );
    },
    cell: ({ getValue, row }) => {
      const projectAvatarUrl = row.original.projectAvatarUrl;
      const projectName = row.original.projectName;
      const val = Number(getValue());
      return (
        <div className="flex items-center gap-2">
          <img
            src={projectAvatarUrl}
            alt={projectName}
            className="h-4 w-4 rounded  object-cover shrink-0 "
          />
          <span>{val === 0 ? '0' : val.toFixed(2)}</span>
        </div>
      );
      return;
    },
  }));

  const tailColumns: ColumnDef<ManagerDashboardRow>[] = [
    {
      id: 'perProjectTotal',
      accessorKey: 'perProjectTotal',
      header: 'Σ Per Project Total',
      cell: ({ getValue }) => Number(getValue()).toFixed(2),
    },
    {
      id: 'total',
      accessorKey: 'totalUserHours',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Calculator className="h-4 w-4" />
          Total
        </div>
      ),
      cell: ({ getValue }) => <span className="text-right">{Number(getValue())}</span>,
    },
    {
      id: 'employedTime',
      accessorKey: 'employedTimePercent',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Clock8 className="h-4 w-4" />
          Employed Time %
        </div>
      ),
      cell: () => {
        // const percent = Number(getValue());
        // const isOverworked = percent > 100;
        // return (
        //   <div className="flex items-center gap-2 w-32">
        //     <span className="text-sm font-medium w-10">{percent}%</span>
        //     <Progress
        //       value={percent > 100 ? 100 : percent}
        //       className={`h-2 ${isOverworked ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'}`}
        //     />
        //   </div>
        // );
      },
    },
    {
      id: 'pto',
      accessorKey: 'ptoHours',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Plane className="h-4 w-4" />
          PTO Hours
        </div>
      ),
      cell: ({ getValue }) => Number(getValue()),
    },
    {
      id: 'pm',
      accessorKey: 'pmName',
      header: () => (
        <div className="flex items-center gap-1.5">
          <CircleUserRound className="h-4 w-4" />
          PM
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-4 w-4">
            <AvatarImage src={row.original.pmAvatarUrl || ''} />
          </Avatar>
          <span className="text-[14px] text-[#1F1F1F]">{row.original.pmName}</span>
        </div>
      ),
    },
    {
      id: 'format',
      accessorKey: 'format',
      header: () => (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4" />
          Format
        </div>
      ),
      cell: ({ getValue }) => {
        const val = String(getValue());
        return val === 'FULL_TIME' ? 'Full-time' : 'Part-time';
      },
    },
  ];

  return [...baseColumns, ...weekColumns, ...tailColumns];
};
