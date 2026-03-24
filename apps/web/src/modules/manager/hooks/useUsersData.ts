import { useQuery } from '@tanstack/react-query';
import { getUsersInfo } from '../api/timeTrackingTable.api';
import type { ManagerDashboardResponse } from '../types/managerAIChat.types';

/**
 * @example - 5 minutes
 * staleTimeMs: 1000 * 60 * 5,
 */
const USE_USERS_DATA_CONFIG = {
  staleTimeMs: 1000 * 60 * 5,
};

export const useUsersData = (from: string, to: string, search?: string) => {
  return useQuery<ManagerDashboardResponse, Error>({
    queryKey: ['usersData', from, to, search],
    queryFn: () => getUsersInfo({ from, to, search }),
    staleTime: USE_USERS_DATA_CONFIG.staleTimeMs,
  });
};
