import { useState, useMemo } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@components/PageHeader';
import { Calendar } from '@/shared/components/ui/calendar';
import { useTimeLogsByPeriod } from '../hooks/useTimeLogs';
import { groupLogsToDays } from '../utils/groupLogs';
import { DayCard } from '../components/DayCard';
import { DayCardSkeleton } from '../components/DayCardSkeleton';

export default function MyTimeLogsPage() {
  const [currentWeekBaseDate, setCurrentWeekBaseDate] = useState<Date>(new Date());

  const weekStart = startOfWeek(currentWeekBaseDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekBaseDate, { weekStartsOn: 1 });

  const fromStr = format(weekStart, 'yyyy-MM-dd');
  const toStr = format(weekEnd, 'yyyy-MM-dd');

  const { data: timeLogs, isLoading, isError } = useTimeLogsByPeriod(fromStr, toStr);

  const logDates = useMemo(() => {
    if (!timeLogs) return [];
    return timeLogs.map(log => new Date(log.date));
  }, [timeLogs]);

  const groupedLogsByDays = groupLogsToDays(fromStr, toStr, timeLogs);

  const totalWeekHours = groupedLogsByDays.reduce((sum, day) => sum + day.totalHours, 0);

  const handlePrevWeek = () => setCurrentWeekBaseDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekBaseDate(prev => addWeeks(prev, 1));

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

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevWeek}
                className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <h3 className="text-[1.15rem] font-bold text-gray-900">{formatWeekRange()}</h3>

              <button
                onClick={handleNextWeek}
                className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="text-gray-500 font-medium text-sm">
              Total for week:{' '}
              <span className="font-bold text-gray-900 ml-1">{totalWeekHours.toFixed(1)}</span>
            </div>
          </div>

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

        <div className="w-full lg:w-[320px] shrink-0">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm">
            <Calendar
              mode="single"
              selected={currentWeekBaseDate}
              onSelect={date => date && setCurrentWeekBaseDate(date)}
              month={weekStart}
              onMonthChange={setCurrentWeekBaseDate}
              className="w-full p-0"
              weekStartsOn={1}
              modifiers={{
                hasLog: logDates,
              }}
              modifiersClassNames={{
                hasLog:
                  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-[#509665] aria-selected:after:bg-white after:rounded-full",
              }}
              classNames={{
                months: 'w-full',
                month: 'w-full',
                caption: 'flex justify-between items-center mb-6',
                caption_label: 'text-base font-bold text-gray-900',
                nav: 'flex items-center gap-2',
                nav_button:
                  'h-8 w-8 bg-transparent p-0 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50',
                nav_button_previous: '!static',
                nav_button_next: '!static',
                table: 'w-full border-collapse',
                head_row: 'flex w-full justify-between mb-2',
                head_cell: 'text-gray-900 font-bold text-sm w-9 text-center',
                row: 'flex w-full justify-between mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-medium rounded-full flex items-center justify-center hover:bg-gray-100 aria-selected:opacity-100 transition-colors',
                day_selected:
                  'bg-[#509665] text-white hover:bg-[#438255] hover:text-white focus:bg-[#509665] focus:text-white',
                day_today: 'bg-gray-100 text-gray-900',
                day_outside: 'text-gray-300 opacity-50',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
