import { axiosPrivate } from '@/shared/api';

export const getUserByUsername = async (username: string): Promise<{ id: string }[]> => {
  const { data } = await axiosPrivate.get(`/users/${username}`);

  return data;
};
