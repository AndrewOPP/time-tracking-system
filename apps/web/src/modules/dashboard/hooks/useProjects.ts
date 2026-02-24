import { useQuery } from '@tanstack/react-query';
import { fetchProjectById, fetchProjects } from '../types/project.api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'], // Уникальный ключ для кэширования
    queryFn: fetchProjects,
  });
};

export const useProjectById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['projects', id],

    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return fetchProjectById(id);
    },

    enabled: !!id,
  });
};
