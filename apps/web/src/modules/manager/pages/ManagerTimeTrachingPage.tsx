import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@components/PageHeader';
import { useUsersData } from '../hooks/useUsersData';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { TimeTrackingTable } from '../components/TimeTrackingTableComponents/TimeTrackingTable';
import { SlidersHorizontal } from 'lucide-react';
import { TableSkeleton } from '../components/TimeTrackingTableComponents/TableSkeleton';

export function ManagerTimeTrachingPage() {
  const from = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const to = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useUsersData(
    from,
    to
  );

  const [isPageAnimationDone, setIsPageAnimationDone] = useState(() => {
    if (data && !isLoading) return true;
    return false;
  });

  const flatTableData = useMemo(() => {
    return data?.pages.flatMap(page => page.tableData) || [];
  }, [data]);

  const weeksInfo = data?.pages[0]?.weeksInfo || [];

  useEffect(() => {
    if (isPageAnimationDone) return;
    const timer = setTimeout(() => setIsPageAnimationDone(true), 450);
    return () => clearTimeout(timer);
  }, [isPageAnimationDone]);

  return (
    <div className="w-full zoom-in-[0.98] animate-in fade-in duration-500">
      <PageHeader
        title="Employee Time Tracking"
        description="Here you can view employee hours and quickly filter data by necessary criteria."
      />

      <div className="flex flex-row gap-2 items-center mb-5 mt-4">
        <div className="h-10 w-10 border border-[#E0E1E2] flex items-center justify-center rounded-[6px] shrink-0 bg-white">
          <SlidersHorizontal className="h-4 w-4" />
        </div>

        <input
          type="text"
          placeholder="Search by employee, project, or PM..."
          className="py-[10px] px-4 text-[16px] text-[#6F6F6F] border border-[#E0E1E2] h-10 w-full max-w-[505px] rounded-[6px] bg-white"
        />
      </div>

      {isLoading || !isPageAnimationDone ? (
        <div className="w-full">
          <TableSkeleton />
        </div>
      ) : (
        <div className="w-full transition-opacity animate-in fade-in duration-500">
          <TimeTrackingTable
            data={flatTableData}
            weeksInfo={weeksInfo}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}
    </div>
  );
}
