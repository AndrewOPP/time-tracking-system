import { PageHeader } from '@components/PageHeader';
import { useUsersData } from '../hooks/useUsersData';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { TimeTrackingTable } from '../components/TimeTrackingTableComponents/TimeTrackingTable';
import { SlidersHorizontal } from 'lucide-react';
import { TableSkeleton } from '../components/TimeTrackingTableComponents/TableSkeleton';

export function ManagerTimeTrachingPage() {
  const from = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const to = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const { data, isLoading } = useUsersData(from, to);

  return (
    <div className="w-full animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
      <PageHeader
        title="Employee Time Tracking"
        description="Here you can view employee hours and quickly filter data by necessary criteria."
      />

      <div className="flex flex-row gap-2 items-center mb-5">
        <div className="h-10 w-10 border border-[#E0E1E2] flex items-center justify-center rounded-[6px]">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by employee, project, or PM..."
          className="py-[10px] px-4 text-[16px] text-[#6F6F6F] border border-[#E0E1E2] h-10 min-w-[505px] rounded-[6px]"
        />
      </div>

      {isLoading ? (
        <div>
          <TableSkeleton />
        </div>
      ) : (
        <TimeTrackingTable data={data!.tableData.slice(0, 20)} weeksInfo={data!.weeksInfo} />
      )}
    </div>
  );
}
