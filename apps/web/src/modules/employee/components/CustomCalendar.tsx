import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LogSummary } from '../types/timeLogs';

interface CustomCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  logSummaries?: LogSummary[];
}

export const CustomCalendar = ({
  selected,
  onSelect,
  month,
  onMonthChange,
  logSummaries = [],
}: CustomCalendarProps) => {
  const yellowDays = logSummaries
    .filter(log => log.totalHours > 0 && log.totalHours < 8)
    .map(log => log.date);

  const greenDays = logSummaries
    .filter(log => log.totalHours >= 8 && log.totalHours <= 9)
    .map(log => log.date);

  const redDays = logSummaries.filter(log => log.totalHours > 9).map(log => log.date);

  const dotBaseClass =
    "[&>button]:after:content-[''] [&>button]:after:absolute [&>button]:after:bottom-1.5 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:w-[4px] [&>button]:after:h-[4px] [&>button]:after:rounded-full";

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      month={month}
      onMonthChange={onMonthChange}
      weekStartsOn={1}
      showOutsideDays={true}
      components={{
        Chevron: props => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4 text-gray-600" />;
          }
          return <ChevronRight className="h-4 w-4 text-gray-600" />;
        },
      }}
      modifiers={{
        logYellow: yellowDays,
        logGreen: greenDays,
        logRed: redDays,
      }}
      modifiersClassNames={{
        logYellow: `${dotBaseClass} [&>button]:after:bg-[#EAB308]`,
        logGreen: `${dotBaseClass} [&>button]:after:bg-[#509665]`,
        logRed: `${dotBaseClass} [&>button]:after:bg-[#EF4444]`,
      }}
      classNames={{
        root: 'w-full relative',
        months: 'w-full',
        month: 'w-full',

        nav: 'absolute right-0 top-0 flex items-center gap-4 z-10',
        button_previous:
          'w-[36px] h-[36px] border border-gray-200 rounded-[6px] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer',
        button_next:
          'w-[36px] h-[36px] border border-gray-200 rounded-[6px] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer',

        month_caption: 'flex items-center min-h-[32px] pb-4.5 mb-4.5 border-b-1 border-[#E0E1E2]',
        caption_label:
          'h-[36px] pt-2 text-center font-semibold text-[18px] leading-none text-gray-900',

        month_grid: 'w-full border-collapse table-fixed',
        weekdays: 'w-full',
        weekday: 'h-10 w-10 text-gray-900 font-bold text-[16px] text-center pb-3 capitalize',
        week: 'w-full',
        day: 'p-0 text-center py-0.5',

        day_button:
          'relative h-10 w-10 mx-auto font-medium rounded-full flex items-center justify-center transition-colors text-gray-700 cursor-pointer hover:bg-gray-100',

        selected: '[&>button]:!bg-[#4E916B] [&>button]:!text-white  [&>button]:after:!bg-white',
        today: '[&>button]:bg-gray-100 [&>button]:font-bold [&>button]:text-gray-900',
        outside: '[&>button]:text-[#E0E1E2]',
      }}
    />
  );
};
