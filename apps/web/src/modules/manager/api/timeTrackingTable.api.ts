import { axiosPrivate } from '@/shared/api';

type GetUsersInfoType = {
  from: string;
  to: string;
  search?: string;
  page: number;
  limit?: number;
};

export const getUsersInfo = async ({ from, to, search, page, limit = 15 }: GetUsersInfoType) => {
  const { data } = await axiosPrivate.get(`/time-logs/manager-report`, {
    params: { from, to, search, page, limit },
  });

  return data;
};
