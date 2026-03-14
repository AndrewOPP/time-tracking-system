import { axiosPrivate } from '@/shared/api';

type GetUsersInfoType = {
  from: string;
  to: string;
  search?: string;
};

export const getUsersInfo = async ({ from, to, search }: GetUsersInfoType) => {
  const { data } = await axiosPrivate.get(`/time-logs/manager-report`, {
    params: { from, to, search },
  });

  return data;
};
