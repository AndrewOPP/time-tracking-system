import { useInfiniteQuery } from '@tanstack/react-query';

import { getUsersInfo } from '../api/timeTrackingTable.api';
import type { ManagerDashboardResponse } from '../types/managerAIChat.types';

/**
 * @example - 5 minutes
 */
const STALE_TIME_MS = 1000 * 60 * 5;

export const useUsersData = (from: string, to: string, search?: string) => {
  return useInfiniteQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: ({ pageParam }) =>
      getUsersInfo({ from, to, search, page: pageParam as number, limit: 17 }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    staleTime: STALE_TIME_MS,
  });
};
