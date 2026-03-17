import { useInfiniteQuery } from '@tanstack/react-query';

import { getUsersInfo } from '../api/timeTrackingTable.api';
import type { ManagerDashboardResponse } from '../types/managerAIChat.types';

export const useUsersData = (from: string, to: string, search?: string) => {
  return useInfiniteQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: ({ pageParam }) =>
      getUsersInfo({ from, to, search, page: pageParam as number, limit: 17 }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
};
