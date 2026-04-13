import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addMonths, format, startOfMonth, endOfMonth } from 'date-fns';

import { getUsersInfo } from '../api/timeTrackingTable.api';

import type { ManagerDashboardResponse } from '../types/managerAIChat.types';

const USE_USERS_DATA_CONFIG = {
  staleTimeMs: 1000 * 60 * 5,
};

const getMonthRangeFromDate = (date: Date) => {
  return {
    from: format(startOfMonth(date), 'yyyy-MM-dd'),
    to: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
};

export const useUsersData = (from: string, to: string, search?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: () => getUsersInfo({ from, to, search }),
    staleTime: USE_USERS_DATA_CONFIG.staleTimeMs,
  });

  useEffect(() => {
    const currentDate = new Date(from);

    const prevDate = addMonths(currentDate, -1);
    const nextDate = addMonths(currentDate, 1);

    const prevRange = getMonthRangeFromDate(prevDate);
    const nextRange = getMonthRangeFromDate(nextDate);

    queryClient.prefetchQuery({
      queryKey: ['usersData', prevRange.from, prevRange.to, search],
      queryFn: () =>
        getUsersInfo({
          from: prevRange.from,
          to: prevRange.to,
          search,
        }),
      staleTime: USE_USERS_DATA_CONFIG.staleTimeMs,
    });

    queryClient.prefetchQuery({
      queryKey: ['usersData', nextRange.from, nextRange.to, search],
      queryFn: () =>
        getUsersInfo({
          from: nextRange.from,
          to: nextRange.to,
          search,
        }),
      staleTime: USE_USERS_DATA_CONFIG.staleTimeMs,
    });
  }, [from, search, queryClient]);

  return query;
};
