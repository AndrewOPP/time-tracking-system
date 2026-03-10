import type { DayGroup, TimeLog } from '../types/timeLogs';

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;

  return dateKey;
};

export const groupLogsToDays = (
  from: string,
  to: string,
  logs: TimeLog[] = [],
  monthType: 'long' | 'short'
): DayGroup[] => {
  const logsByDate = logs.reduce(
    (acc, log) => {
      const logDate = new Date(log.date);
      const dateKey = getDateKey(logDate);

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(log);

      return acc;
    },
    {} as Record<string, TimeLog[]>
  );

  const grouped: DayGroup[] = [];
  const startDay = new Date(from);
  const endDate = new Date(to);

  while (startDay <= endDate) {
    const dateString = getDateKey(startDay);
    const dayLogs = logsByDate[dateString] || [];
    const totalHours = dayLogs.reduce((sum, log) => sum + log.hours, 0);

    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(startDay);
    const dateStr = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: monthType }).format(
      startDay
    );

    grouped.push({
      fullDate: dateString,
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dateStr,
      totalHours,
      entries: dayLogs,
    });

    startDay.setDate(startDay.getDate() + 1);
  }

  return grouped;
};
