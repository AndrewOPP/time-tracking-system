import {
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  eachDayOfInterval,
  isWeekend,
} from 'date-fns';

export interface WeekBoundary {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  workingHours: number;
}

export function getWeeksForMonth(year: number, month: number, hoursPerDay = 8): WeekBoundary[] {
  const firstDayOfMonth = startOfMonth(new Date(year, month - 1));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  const weeks: WeekBoundary[] = [];
  let currentStart = firstDayOfMonth;
  let weekNumber = 1;

  while (currentStart <= lastDayOfMonth) {
    let currentEnd = endOfWeek(currentStart, { weekStartsOn: 1 });

    if (currentEnd > lastDayOfMonth) {
      currentEnd = lastDayOfMonth;
    }

    const daysInterval = eachDayOfInterval({ start: currentStart, end: currentEnd });
    const workingDays = daysInterval.filter(day => !isWeekend(day)).length;

    weeks.push({
      weekNumber,
      startDate: currentStart,
      endDate: currentEnd,
      workingHours: workingDays * hoursPerDay,
    });

    currentStart = addDays(currentEnd, 1);
    weekNumber++;
  }

  return weeks;
}
