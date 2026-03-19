import { axiosPrivate } from '@/shared/api';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { buildPath } from '@/shared/utils/buildPath';

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
  const { data } = await axiosPrivate.get(
    buildPath(API_ROUTES.TIME_LOGS, API_ROUTES.MANAGER_REPORT),
    {
      params: { from, to, search, page, limit },
    }
  );

  return data;
};
