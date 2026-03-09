import { useQuery } from '@tanstack/react-query';
import type { Project } from '../types/timeLogs';
import { fetchProjects } from '@/modules/dashboard/api/project.api';

export const useProjects = (enabled = true) => {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};
