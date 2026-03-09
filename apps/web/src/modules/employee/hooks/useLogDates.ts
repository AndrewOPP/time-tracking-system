// src/hooks/useLogDates.ts
import { useMemo } from 'react';
import { useTimeLogsByPeriod } from '../hooks/useTimeLogs';

export const useLogDates = (
  from: string,
  to: string
): {
  logDates: Date[];
  timeLogs: ReturnType<typeof useTimeLogsByPeriod>['data'];
  isLoading: boolean;
  isError: boolean;
} => {
  const { data: timeLogs, isLoading, isError } = useTimeLogsByPeriod(from, to);

  const logDates = useMemo(() => {
    if (!timeLogs) return [];
    return timeLogs.map(log => new Date(log.date));
  }, [timeLogs]);

  return { logDates, timeLogs, isLoading, isError };
};
