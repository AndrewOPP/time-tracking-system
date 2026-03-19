import { axiosPrivate } from '@/shared/api';
import type { EmployeeProfileResponse } from '../types/employee.types';

export const getUserByUsername = async (username: string): Promise<EmployeeProfileResponse> => {
  const { data } = await axiosPrivate.get(`/users/${username}`);

  return data;
};
