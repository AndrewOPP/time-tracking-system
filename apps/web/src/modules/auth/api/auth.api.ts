import type { AxiosError } from 'axios';
import type { AuthNestApiError, AuthPayload, AuthProvider } from '../types/auth.types';
import { axiosPrivate, axiosPublic } from '@/shared/api';

const extractErrorMessage = (err: unknown): string => {
  const axiosError = err as AxiosError<AuthNestApiError>;
  return axiosError?.response?.data?.message || 'AUTH_UNKNOWN_ERROR';
};

export const loginWithProvider = async (provider: AuthProvider, payload: AuthPayload) => {
  try {
    const { data } = await axiosPublic.post(`/auth/${provider}`, payload);
    return { data, error: null };
  } catch (err: unknown) {
    const errorMsg = extractErrorMessage(err);
    console.error(`Login with ${provider} failed:`, errorMsg);
    return { data: null, error: errorMsg };
  }
};

export const logOut = async () => {
  try {
    const { data } = await axiosPrivate.post(`/auth/logout`);
    return { data, error: null };
  } catch (err: unknown) {
    const errorMsg = extractErrorMessage(err);
    console.error('Logout failed:', errorMsg);
    return { data: null, error: errorMsg };
  }
};

export const tokenRefresh = async () => {
  try {
    const response = await axiosPublic.get('/auth/refresh', {
      withCredentials: true,
    });
    return { data: response.data, error: null };
  } catch (err: unknown) {
    const errorMsg = extractErrorMessage(err);
    console.error('Token refresh failed:', errorMsg);
    return { data: null, error: errorMsg };
  }
};
