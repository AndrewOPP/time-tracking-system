import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { useDebounceValue } from 'usehooks-ts';
import { SearchInput } from '../components/TimeTrackingTableComponents/SearchInput';
import { useMonthNavigation } from '../hooks/useMonthNavigationю';
import { MonthNavigation } from '../components/TimeTrackingTableComponents/MonthNavigation';

const DEBOUNCE_DELAY = 300;

export function ManagerTimeTrachingPage() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  const activeDate = dateParam ? new Date(dateParam) : new Date();

  const monthStart = format(startOfMonth(activeDate), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(activeDate), 'yyyy-MM-dd');

  const monthText = format(activeDate, 'MMMM yyyy');

  const { handlePrevMonth, handleNextMonth } = useMonthNavigation(activeDate);

  const [querySearch, setQuerySearch] = useState<string>('');
  const [debouncedSearch] = useDebounceValue(querySearch, DEBOUNCE_DELAY);

  const { data, isLoading, isError, refetch } = useUsersData(monthStart, monthEnd);

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
      searchQuery: debouncedSearch,
    });
  }, [
    flatTableData,
    selectedEmployees,
    selectedProjects,
    selectedPms,
    ranges,
    selectedFormat,
    debouncedSearch,
  ]);

  const renderContent = () => {
    if (isError) {
      return <TableErrorState onRetry={() => refetch()} />;
    }

    if (isLoading || !isPageAnimationDone) {
      return <TableSkeleton />;
    }

    if (filteredData.length === 0) {
      const emptyMessage = debouncedSearch
        ? 'No data found for your search'
        : 'No data found for the selected filters';

      return <TableEmptyState message={emptyMessage} />;
    }
    return <TimeTrackingTableSection data={filteredData} weeksInfo={weeksInfo} />;
  };

  return (
    <div className=" w-full zoom-in-[0.98] animate-in fade-in duration-500">
      <PageHeader
        title="Employee Time Tracking"
        description="Here you can view employee hours and quickly filter data by necessary criteria."
      />

      <div className="flex flex-row  justify-between gap-2 items-center mb-5">
        <div className="flex flex-row  gap-2 items-center w-full max-w-[550px]">
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

          <SearchInput
            value={querySearch}
            onChange={setQuerySearch}
            placeholder="Search by employee, project, or PM..."
          />
        </div>

        <div className="mt-4 mb-4 ">
          <MonthNavigation
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            monthText={monthText}
          />
        </div>
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
