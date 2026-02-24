import { useQuery } from '@tanstack/react-query';
import { fetchProjectById, fetchProjects } from '../types/project.api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 3 * 60 * 1000,
  });
};

export const useProjectById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['projects', id],

    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return fetchProjectById(id);
    },
    staleTime: 3 * 60 * 1000,
    enabled: !!id,
  });
};
