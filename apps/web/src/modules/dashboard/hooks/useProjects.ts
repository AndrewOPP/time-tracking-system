import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../types/project.api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'], // Уникальный ключ для кэширования
    queryFn: fetchProjects,
  });
};
