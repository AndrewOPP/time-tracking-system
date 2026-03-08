import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, isSameMonth } from 'date-fns';
import { PageHeader } from '@components/PageHeader';
import { useTimeLogsByPeriod } from '../hooks/useTimeLogs';
import { groupLogsToDays } from '../utils/groupLogs';
import { DayCard } from '../components/DayCard';
import { DayCardSkeleton } from '../components/DayCardSkeleton';
import { CustomCalendar } from '../components/CustomCalendar';
import { WeekNavigation } from '../components/WeekNavigation';

export default function MyTimeLogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateParam = searchParams.get('date');
  const activeDate = useMemo(() => (dateParam ? new Date(dateParam) : new Date()), [dateParam]);

  const weekStart = useMemo(() => startOfWeek(activeDate, { weekStartsOn: 1 }), [activeDate]);
  const weekEnd = useMemo(() => endOfWeek(activeDate, { weekStartsOn: 1 }), [activeDate]);

  const [calendarMonth, setCalendarMonth] = useState<Date>(weekStart);
  const [prevDateParam, setPrevDateParam] = useState(dateParam);

  if (dateParam !== prevDateParam) {
    setPrevDateParam(dateParam);
    setCalendarMonth(activeDate);
  }

  const fromStr = format(weekStart, 'yyyy-MM-dd');
  const toStr = format(weekEnd, 'yyyy-MM-dd');

  const { data: timeLogs, isLoading, isError } = useTimeLogsByPeriod(fromStr, toStr);

  const logDates = useMemo(() => {
    if (!timeLogs) return [];
    return timeLogs.map(log => new Date(log.date));
  }, [timeLogs]);

  const groupedLogsByDays = groupLogsToDays(fromStr, toStr, timeLogs);
  const totalWeekHours = groupedLogsByDays.reduce((sum, day) => sum + day.totalHours, 0);

  const updateDateInUrl = (newDate: Date) => {
    setSearchParams({ date: format(newDate, 'yyyy-MM-dd') });
  };

  const handlePrevWeek = () => updateDateInUrl(subWeeks(activeDate, 1));
  const handleNextWeek = () => updateDateInUrl(addWeeks(activeDate, 1));

  const formatWeekRange = () => {
    if (isSameMonth(weekStart, weekEnd)) {
      return `${format(weekStart, 'MMMM d')}–${format(weekEnd, 'd, yyyy')}`;
    } else {
      return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div className="w-full animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
      <PageHeader
        title="My Time Logs"
        description="Your work week is displayed here. Record your daily hours to easily monitor your performance."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <WeekNavigation
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            weekRangeText={formatWeekRange()}
            totalHours={totalWeekHours}
          />

          {isLoading ? (
            <div className="flex flex-col">
              {Array.from({ length: 7 }).map((_, i) => (
                <DayCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-red-500">Failed to load time logs.</div>
          ) : (
            <div className="flex flex-col">
              {groupedLogsByDays.map((day, index) => (
                <DayCard key={day.fullDate} dayData={day} index={index} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-[12px] py-5 px-6 shadow-sm">
            <CustomCalendar
              selected={activeDate}
              onSelect={date => date && updateDateInUrl(date)}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              logDates={logDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
