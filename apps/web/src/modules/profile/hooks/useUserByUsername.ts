import { useQuery } from '@tanstack/react-query';
import { getUserByUsername } from '../api/getUserByUsername';

export const useUserByUsername = (username: string | undefined) => {
  return useQuery({
    queryKey: ['users', username],
    queryFn: () => {
      if (!username) throw new Error('Username is required');
      return getUserByUsername(username);
    },
    staleTime: 3 * 60 * 1000,
  });
};
