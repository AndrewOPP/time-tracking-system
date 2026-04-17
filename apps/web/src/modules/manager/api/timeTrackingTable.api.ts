import { axiosPrivate } from '@/shared/api';
import { API_ROUTES } from '@/shared/constants/apiRoutes';
import { buildPath } from '@/shared/utils/buildPath';

type GetUsersInfoType = {
  from: string;
  to: string;
  search?: string;
};

export const getUsersInfo = async ({ from, to, search }: GetUsersInfoType) => {
  const { data } = await axiosPrivate.get(
    buildPath(API_ROUTES.TIME_LOGS, API_ROUTES.MANAGER_REPORT),
    { params: { from, to, search } }
  );
  return data;
};
