import { PageHeader } from '@components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Link } from 'react-router-dom';
import { useManagerDashboardOverview } from '../hooks/useManagerDashboard';

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
import { KpiCard } from '../components/ManagerDashboardComponents/KpiCard';
import { EmployeeListItem } from '../components/ManagerDashboardComponents/EmployeeListItem';
import { NoDataMessage } from '../components/ManagerDashboardComponents/NoDataMessage';
import { DashboardSkeleton } from '../components/ManagerDashboardComponents/DashboardSkeleton';

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
