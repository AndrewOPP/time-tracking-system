import { axiosPrivate } from '@/shared/api';
import { API_ROUTES } from '@/shared/constants/apiRoutes';

export const DEFAULT_LIMIT = 15;

type GetUsersInfoType = {
  from: string;
  to: string;
  search?: string;
  page: number;
  limit?: number;
};

export const getUsersInfo = async ({
  from,
  to,
  search,
  page,
  limit = DEFAULT_LIMIT,
}: GetUsersInfoType) => {
  const { data } = await axiosPrivate.get(API_ROUTES.TIME_LOG_MANAGER_REPORT, {
    params: { from, to, search, page, limit },
  });

  return data;
};
