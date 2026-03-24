import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@components/PageHeader';
import { useUsersData } from '../hooks/useUsersData';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { TableSkeleton } from '../components/TimeTrackingTableComponents/TableSkeleton';
import { TimeTrackingTableSection } from '../components/TimeTrackingTableComponents/TimeTrackingTableSection';
import { TableEmptyState } from '../components/TimeTrackingTableComponents/TableEmptyState';
import { TableErrorState } from '../components/TimeTrackingTableComponents/TableErrorState';
import { FiltersPopover } from '../components/TimeTrackingTableComponents/FiltersPopover';
import { useTableFilters } from '../hooks/useTableFilters';
import { simpleTableFilter } from '../utils/tableDataFilter';
import { ActiveFiltersBar } from '../components/TimeTrackingTableComponents/ActiveFiltersBar';

const CURRENT_MONTH_START = format(startOfMonth(new Date()), 'yyyy-MM-dd');
const CURRENT_MONTH_END = format(endOfMonth(new Date()), 'yyyy-MM-dd');

export function ManagerTimeTrachingPage() {
  const [querySearch, setQuerySearch] = useState<string>('');
  const { data, isLoading, isError, refetch } = useUsersData(
    CURRENT_MONTH_START,
    CURRENT_MONTH_END
  );

  const flatTableData = useMemo(() => data?.tableData || [], [data?.tableData]);
  const weeksInfo = useMemo(() => data?.weeksInfo || [], [data?.weeksInfo]);

  const [isPageAnimationDone, setIsPageAnimationDone] = useState(() => !!(data && !isLoading));

  useEffect(() => {
    if (isPageAnimationDone) return;
    const timer = setTimeout(() => setIsPageAnimationDone(true), 550);
    return () => clearTimeout(timer);
  }, [isPageAnimationDone]);

  const {
    selectedEmployees,
    selectedProjects,
    selectedPms,
    ranges,
    selectedFormat,
    toggleEmployee,
    toggleProject,
    togglePm,
    setRangeValue,
    setFormat,
    clearCategory,
    clearAllFilters,
  } = useTableFilters();

  const filteredData = useMemo(() => {
    return simpleTableFilter(flatTableData, {
      selectedEmployees,
      selectedProjects,
      selectedPms,
      ranges,
      selectedFormat,
      searchQuery: querySearch,
    });
  }, [
    flatTableData,
    selectedEmployees,
    selectedProjects,
    selectedPms,
    ranges,
    selectedFormat,
    querySearch,
  ]);

  const renderContent = () => {
    if (isError) {
      return <TableErrorState onRetry={() => refetch()} />;
    }

    if (isLoading || !isPageAnimationDone) {
      return <TableSkeleton />;
    }

    if (filteredData.length === 0) {
      return <TableEmptyState />;
    }
    return <TimeTrackingTableSection data={filteredData} weeksInfo={weeksInfo} />;
  };

  return (
    <div className=" w-full zoom-in-[0.98] animate-in fade-in duration-500">
      <PageHeader
        title="Employee Time Tracking"
        description="Here you can view employee hours and quickly filter data by necessary criteria."
      />

      <div className="flex flex-row gap-2 items-center mb-5 mt-4">
        <FiltersPopover
          weeksInfo={weeksInfo}
          flatTableData={flatTableData}
          selectedEmployees={selectedEmployees}
          selectedProjects={selectedProjects}
          selectedPms={selectedPms}
          ranges={ranges}
          selectedFormat={selectedFormat}
          toggleEmployee={toggleEmployee}
          toggleProject={toggleProject}
          togglePm={togglePm}
          setRangeValue={setRangeValue}
          setFormat={setFormat}
        />

        <input
          type="text"
          onChange={e => setQuerySearch(e.currentTarget.value)}
          placeholder="Search by employee, project, or PM..."
          className="py-[10px] px-4 text-[16px] text-[#6F6F6F] border border-[#E0E1E2] h-10 w-full max-w-[505px] rounded-[6px] bg-white outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      <ActiveFiltersBar
        ranges={ranges}
        selectedFormat={selectedFormat}
        selectedEmployees={selectedEmployees}
        selectedProjects={selectedProjects}
        selectedPms={selectedPms}
        onClearCategory={clearCategory}
        onClearAll={clearAllFilters}
      />

      {renderContent()}
    </div>
  );
}
