import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

import { PageHeader } from '@components/PageHeader';
import { DayCard } from '../components/DayCard';
import { DayCardSkeleton } from '../components/DayCardSkeleton';
import { CustomCalendar } from '../components/CustomCalendar';
import { WeekNavigation } from '../components/WeekNavigation';
import { LogTimeModal } from '../components/LogtimeModal/LogTimeModal';
import { DeleteTimeLogModal } from '../components/DeleteTimeLogModal';

import { useDialogStore } from '../store/useDialogStore';
import { useWeekRange } from '../hooks/useWeekRange';
import { useWeekNavigation } from '../hooks/useWeekNavigation';
import { useLogDates } from '../hooks/useLogDates';
import { groupLogsToDays } from '../utils/groupLogs';
import { useLogSummaries } from '../hooks/useLogSummaries';

export default function MyTimeLogsPage() {
  const { openDialog } = useDialogStore();

  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  const activeDate = useMemo(() => (dateParam ? new Date(dateParam) : new Date()), [dateParam]);

  const { weekStart, weekEnd, weekRangeLabel } = useWeekRange(activeDate);
  const { handlePrevWeek, handleNextWeek, updateDateInUrl } = useWeekNavigation(activeDate);

  const [calendarMonth, setCalendarMonth] = useState(weekStart);

  useEffect(() => {
    setCalendarMonth(activeDate);
  }, [activeDate]);

  const fromStr = format(weekStart, 'yyyy-MM-dd');
  const toStr = format(weekEnd, 'yyyy-MM-dd');

  const { timeLogs, isLoading, isError } = useLogDates(fromStr, toStr);

  const groupedLogsByDays = useMemo(() => {
    return groupLogsToDays(fromStr, toStr, timeLogs || []);
  }, [fromStr, toStr, timeLogs]);

  const { logSummaries } = useLogSummaries(timeLogs || []);

  const totalWeekHours = groupedLogsByDays.reduce((sum, day) => sum + day.totalHours, 0);

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
            weekRangeText={weekRangeLabel}
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
                <DayCard
                  key={day.fullDate}
                  dayData={day}
                  index={index}
                  onTrackClick={() => openDialog('TRACK_TIME', { date: day.fullDate })}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[380px] shrink-0">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-[12px] py-5 px-6 ">
            <CustomCalendar
              selected={activeDate}
              onSelect={date => date && updateDateInUrl(date)}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              logSummaries={logSummaries}
            />
          </div>
        </div>
      </div>

      <LogTimeModal from={fromStr} to={toStr} />
      <DeleteTimeLogModal />
    </div>
  );
}
