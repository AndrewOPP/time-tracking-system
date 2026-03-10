import { useMemo } from 'react';
import type { LogSummary, TimeLog } from '../types/timeLogs';
import { format } from 'date-fns';

export const useLogSummaries = (
  timeLogs: TimeLog[]
): {
  logSummaries: LogSummary[];
} => {
  const logSummaries = useMemo(() => {
    const sums = timeLogs.reduce<Record<string, number>>((acc, log) => {
      const dateKey = format(new Date(log.date), 'yyyy-MM-dd');

      acc[dateKey] = (acc[dateKey] ?? 0) + Number(log.hours);
      return acc;
    }, {});

    return Object.entries(sums).map(([date, totalHours]) => ({
      date: new Date(`${date}T00:00:00`),
      totalHours,
    }));
  }, [timeLogs]);

  return { logSummaries };
};
