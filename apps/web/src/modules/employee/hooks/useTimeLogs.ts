import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { parseISO, addWeeks, subWeeks, format, differenceInDays } from 'date-fns';
import { findLogsByPeriod } from '../api/myTimeLogs.api';

export const useTimeLogsByPeriod = (from: string, to: string, projectId?: string) => {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['timeLogs', from, to, projectId],
    queryFn: () => findLogsByPeriod(from, to, projectId),
    enabled: !!from && !!to,
    select: data => {
      return data.map(log => ({
        ...log,
        hours: Number(log.hours),
      }));
    },
    staleTime: 3 * 60 * 1000,
  });

  useEffect(() => {
    if (!from || !to) return;

    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    const daysDiff = differenceInDays(toDate, fromDate);
    if (daysDiff > 7) {
      return;
    }

    const nextFrom = format(addWeeks(fromDate, 1), 'yyyy-MM-dd');
    const nextTo = format(addWeeks(toDate, 1), 'yyyy-MM-dd');

    const prevFrom = format(subWeeks(fromDate, 1), 'yyyy-MM-dd');
    const prevTo = format(subWeeks(toDate, 1), 'yyyy-MM-dd');

    const prefetch = (start: string, end: string) => {
      queryClient.prefetchQuery({
        queryKey: ['timeLogs', start, end],
        queryFn: () => findLogsByPeriod(start, end),
        staleTime: 3 * 60 * 1000,
      });
    };

    prefetch(nextFrom, nextTo);
    prefetch(prevFrom, prevTo);
  }, [from, to, queryClient]);

  return queryResult;
};
