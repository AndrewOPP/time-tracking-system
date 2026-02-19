import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { axiosPrivate } from './api-instance';
import { toast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { getAuthErrorMessage } from '../utils/error-handler';
import type { AuthNestApiError } from '@/modules/auth/types/auth.types';
import { tokenRefresh } from '@/modules/auth/api/auth.api';

axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers = new AxiosHeaders(config.headers);
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?._retry) {
      prevRequest._retry = true;

      try {
        const response = await tokenRefresh();

        const { accessToken, user } = response.data;

        useAuthStore.getState().setAuth(user, accessToken);

        prevRequest.headers = new AxiosHeaders(prevRequest.headers);
        prevRequest.headers.set('Authorization', `Bearer ${accessToken}`);

        return axiosPrivate(prevRequest);
      } catch (refreshError: unknown) {
        const error = refreshError as AxiosError<AuthNestApiError>;
        useAuthStore.getState().clearAuth();
        const apiErrorMessage = error?.response?.data?.message || 'AUTH_UNKNOWN_ERROR';

        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: getAuthErrorMessage(apiErrorMessage),
        });
        setTimeout(() => {
          // window.location.href = ROUTES.AUTH.LOGIN;
        }, 2500);

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
