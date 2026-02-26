import { extractApiError } from '@/shared/utils/extractApiError';
import type { AuthPayload, AuthProvider } from '../types/auth.types';
import { axiosPrivate, axiosPublic } from '@/shared/api';

export const loginWithProvider = async (provider: AuthProvider, payload: AuthPayload) => {
  try {
    const { data } = await axiosPublic.post(`/auth/${provider}`, payload);
    return { data, error: null };
  } catch (err: unknown) {
    console.log(err);
    const errorMsg = extractApiError(err, 'AUTH_DEFAULT_FAILED');
    console.error(`Login with ${provider} failed:`, errorMsg);
    return { data: null, error: errorMsg };
  }
};

export const logOut = async () => {
  try {
    const { data } = await axiosPrivate.post(`/auth/logout`);
    return { data, error: null };
  } catch (err: unknown) {
    const errorMsg = extractApiError(err, 'AUTH_LOGOUT_FAILED');
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
    const errorMsg = extractApiError(err, 'AUTH_REFRESH_FAILED');
    return { data: null, error: errorMsg };
  }
};
