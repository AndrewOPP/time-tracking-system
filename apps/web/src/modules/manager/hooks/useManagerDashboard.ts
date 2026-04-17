import { useQuery } from '@tanstack/react-query';
import { getManagerDashboardOverview } from '../api/managerDashboard';

export const managerDashboardKeys = {
  all: ['manager-dashboard'] as const,
  overview: () => [...managerDashboardKeys.all, 'overview'] as const,
};

export const useManagerDashboardOverview = () => {
  return useQuery({
    queryKey: managerDashboardKeys.overview(),
    queryFn: getManagerDashboardOverview,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
};
