import { PageHeader } from '@components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import { cn } from '@lib/utils';
import { Link } from 'react-router-dom'; // Добавлен импорт Link
import { useManagerDashboardOverview } from '../hooks/useManagerDashboard';

// Імпортуємо іконки
import {
  Clock,
  UserCheck,
  AlertOctagon,
  Briefcase,
  Activity,
  Users,
  Palmtree,
  GaugeCircle,
} from 'lucide-react';

export function ManagerDashboardPage() {
  const { data, isLoading, isError } = useManagerDashboardOverview();

  if (isError) {
    return (
      <div className="p-6 text-destructive font-medium flex items-center gap-2 bg-red-50 rounded-lg m-6">
        <AlertOctagon className="w-5 h-5" />
        Failed to load dashboard data. Please try refreshing the page.
      </div>
    );
  }

  const sortedAvailableEmployees = data?.mostAvailableEmployees
    ? [...data.mostAvailableEmployees].sort((a, b) => {
        if (a.loadPercent === b.loadPercent) return a.name.localeCompare(b.name);
        return a.loadPercent - b.loadPercent;
      })
    : [];

  const hasOverloaded = data && data.kpis.overloadedEmployeesCount > 0;

  return (
    <div className="space-y-8 pb-1 min-h-screen  animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
      <PageHeader
        title="Manager Dashboard"
        description={`Capacity and resource distribution for the last 2 weeks.`}
      />

      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <KpiCard
              title="Tracked Time"
              value={`${data.kpis.totalTrackedHours}h`}
              description={`${data.kpis.activeEmployeesCount} active employees`}
              icon={Clock}
              iconColor="text-blue-600"
              iconBg="bg-blue-100/80"
            />
            <KpiCard
              title="Available Now"
              value={data.kpis.availableEmployeesCount}
              description="Below 100% capacity"
              icon={UserCheck}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100/80"
            />
            <KpiCard
              title="Overloaded"
              value={data.kpis.overloadedEmployeesCount}
              description="Above 100% capacity"
              icon={AlertOctagon}
              iconColor={hasOverloaded ? 'text-red-600' : 'text-slate-400'}
              iconBg={hasOverloaded ? 'bg-red-100' : 'bg-slate-100'}
              className=" bg-red-50/30'"
            />
            <KpiCard
              title="Active Projects"
              value={data.kpis.activeProjectsCount}
              description="With logged hours"
              icon={Briefcase}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-100/80"
            />

            <KpiCard
              title="Avg. Team Load"
              value={`${data.kpis.averageTeamLoad}%`}
              description="Overall utilization"
              icon={Activity}
              iconColor="text-amber-600"
              iconBg="bg-amber-100/80"
            />
            <KpiCard
              title="Part-time Staff"
              value={data.kpis.partTimeCount}
              description="Reduced capacity members"
              icon={Users}
              iconColor="text-violet-600"
              iconBg="bg-violet-100/80"
            />
            <KpiCard
              title="Average PTO"
              value={`${data.kpis.averagePtoHours}h`}
              description="Time off per employee"
              icon={Palmtree}
              iconColor="text-teal-600"
              iconBg="bg-teal-100/80"
            />
            <KpiCard
              title="Capacity Gap"
              value={`${data.kpis.capacityGap}%`}
              description="Remaining free space"
              icon={GaugeCircle}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100/80"
            />
          </div>

          {/* БЛОК 2: СПИСКИ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Найбільш вільні */}
            <Card className="border-slate-200 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  Ready for Tasks
                </CardTitle>
                <CardDescription className="text-xs">
                  Employees with the most available hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {sortedAvailableEmployees.map(emp => (
                    <EmployeeListItem
                      key={emp.id}
                      employee={emp}
                      subtitle={`${emp.ptoHours}h PTO`}
                    />
                  ))}
                  {sortedAvailableEmployees.length === 0 && (
                    <NoDataMessage message="No available employees found." />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Найбільш завантажені */}
            <Card className="border-slate-200 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  Highest Load
                </CardTitle>
                <CardDescription className="text-xs">Watch out for burnout risk.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {data.highestLoadEmployees.map(emp => (
                    <EmployeeListItem
                      key={emp.id}
                      employee={emp}
                      subtitle={`${emp.activeProjectsCount} active ${
                        emp.activeProjectsCount === 1 ? 'proj.' : 'projects'
                      }`}
                    />
                  ))}
                  {data.highestLoadEmployees.length === 0 && (
                    <NoDataMessage message="No workload data found." />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Топ проєктів */}
            <Card className="border-slate-200 overflow-hidden py-0 gap-0">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  Top Time-Sinks
                </CardTitle>
                <CardDescription className="text-xs">
                  Projects absorbing the most hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {data.topProjects.map((project, idx) => (
                    <Link
                      key={project.id}
                      to={`/dashboard/${project.id}`}
                      className="flex justify-between items-center p-4 py-5 hover:bg-slate-50 transition-colors cursor-pointer group h-[92px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold text-xs border border-indigo-100 shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <div
                            className="font-medium text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[160px]"
                            title={project.name}
                          >
                            {project.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {project.membersCount}{' '}
                            {project.membersCount === 1 ? 'member' : 'members'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-sm text-slate-700 bg-slate-100/50 px-2 py-1 rounded">
                          {project.totalHours}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">h</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {data.topProjects.length === 0 && (
                    <NoDataMessage message="No active projects this month." />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// --- КОМПОНЕНТИ ---

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn('border-slate-200 transition-all flex flex-col justify-center py-0', className)}
    >
      <CardContent className="p-5 flex justify-between items-center gap-4 h-full">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{description}</p>
        </div>

        <div className={cn('p-3 rounded-xl shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} strokeWidth={2} />
        </div>
      </CardContent>
    </Card>
  );
}

interface EmployeeListItemProps {
  employee: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    workFormat: string;
    loadPercent: number;
  };
  subtitle: string;
}

function EmployeeListItem({ employee, subtitle }: EmployeeListItemProps) {
  const safePercent = Math.min(Math.max(employee.loadPercent, 0), 100);

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-600';

  if (employee.loadPercent >= 80 && employee.loadPercent <= 100) {
    barColor = 'bg-amber-400';
    textColor = 'text-amber-600';
  } else if (employee.loadPercent > 100) {
    barColor = 'bg-red-500';
    textColor = 'text-red-600';
  }

  return (
    <Link
      to={`/profile/${employee.username}`}
      className="block p-4 hover:bg-slate-50 transition-colors group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-white shrink-0">
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            <AvatarFallback className="text-xs bg-slate-100 font-semibold text-slate-600">
              {employee.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {employee.name}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-medium uppercase text-slate-500 border-slate-200"
              >
                {employee.workFormat.replace('_', '-')}
              </Badge>
              <span>•</span>
              <span>{subtitle}</span>
            </div>
          </div>
        </div>
        <div className={cn('font-semibold text-sm shrink-0 mt-1', textColor)}>
          {employee.loadPercent}%
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </Link>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-3">
        <Activity className="w-5 h-5 opacity-20" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-5 flex justify-between items-center h-full">
              <div className="space-y-3 w-full">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-2 w-32" />
              </div>
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="bg-slate-50/50 pb-4">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent className="p-0">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="p-4 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3 items-center">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-10 shrink-0 mt-1" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
