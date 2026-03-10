import { useMemo } from 'react';
import { startOfWeek, endOfWeek, isSameMonth, format } from 'date-fns';

export interface WeekRange {
  weekStart: Date;
  weekEnd: Date;
  weekRangeLabel: string;
}

export const useWeekRange = (activeDate: Date): WeekRange => {
  const weekStart = useMemo(() => startOfWeek(activeDate, { weekStartsOn: 1 }), [activeDate]);
  const weekEnd = useMemo(() => endOfWeek(activeDate, { weekStartsOn: 1 }), [activeDate]);

  const weekRangeLabel = useMemo(() => {
    if (isSameMonth(weekStart, weekEnd)) {
      return `${format(weekStart, 'MMMM d')} – ${format(weekEnd, 'd, yyyy')}`;
    }
    return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
  }, [weekStart, weekEnd]);

  return { weekStart, weekEnd, weekRangeLabel };
};
