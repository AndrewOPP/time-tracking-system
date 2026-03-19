import { useInfiniteQuery } from '@tanstack/react-query';

import { getUsersInfo } from '../api/timeTrackingTable.api';
import type { ManagerDashboardResponse } from '../types/managerAIChat.types';

/**
 * @example - 5 minutes
 * staleTimeMs: 1000 * 60 * 5,
 */
const USE_USERS_DATA_CONFIG = {
  staleTimeMs: 1000 * 60 * 5,
  limit: 17,
};

export const useUsersData = (from: string, to: string, search?: string) => {
  return useInfiniteQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: ({ pageParam }) =>
      getUsersInfo({
        from,
        to,
        search,
        page: pageParam as number,
        limit: USE_USERS_DATA_CONFIG.limit,
      }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    staleTime: USE_USERS_DATA_CONFIG.staleTimeMs,
  });
};
