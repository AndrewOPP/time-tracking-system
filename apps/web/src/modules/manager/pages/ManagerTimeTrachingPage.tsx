import { useState, useEffect } from 'react';
import { PageHeader } from '@components/PageHeader';
import { useUsersData } from '../hooks/useUsersData';

import { format, startOfMonth, endOfMonth } from 'date-fns';
import { SlidersHorizontal } from 'lucide-react';

import { TableSkeleton } from '../components/TimeTrackingTableComponents/TableSkeleton';
import { TimeTrackingTableSection } from '../components/TimeTrackingTableComponents/TimeTrackingTableSection';
import { TableEmptyState } from '../components/TimeTrackingTableComponents/TableEmptyState';
import { TableErrorState } from '../components/TimeTrackingTableComponents/TableErrorState';

const CURRENT_MONTH_START = format(startOfMonth(new Date()), 'yyyy-MM-dd');
const CURRENT_MONTH_END = format(endOfMonth(new Date()), 'yyyy-MM-dd');

export function ManagerTimeTrachingPage() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUsersData(CURRENT_MONTH_START, CURRENT_MONTH_END);
  console.log(data);

  const flatTableData = data?.pages.flatMap(p => p.tableData) || [];
  const weeksInfo = data?.pages[0]?.weeksInfo || [];

  const [isPageAnimationDone, setIsPageAnimationDone] = useState(() => !!(data && !isLoading));

  useEffect(() => {
    if (isPageAnimationDone) return;
    const timer = setTimeout(() => setIsPageAnimationDone(true), 550);
    return () => clearTimeout(timer);
  }, [isPageAnimationDone]);

  const renderContent = () => {
    if (isError) {
      return <TableErrorState onRetry={() => refetch()} />;
    }

    if (isLoading || !isPageAnimationDone) {
      return <TableSkeleton />;
    }

    if (flatTableData.length === 0) {
      return <TableEmptyState />;
    }

    return (
      <TimeTrackingTableSection
        data={flatTableData}
        weeksInfo={weeksInfo}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    );
  };

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
          className="py-[10px] px-4 text-[16px] text-[#6F6F6F] border border-[#E0E1E2] h-10 w-full max-w-[505px] rounded-[6px] bg-white outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {renderContent()}
    </div>
  );
}
