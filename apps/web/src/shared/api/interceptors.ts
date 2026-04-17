import { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { axiosPrivate } from './api-instance';
import { toast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { getAppErrorMessage } from '../utils/error-handler';
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

      const { data, error: refreshError } = await tokenRefresh();
      if (refreshError || !data) {
        useAuthStore.getState().clearAuth();

        toast({
          variant: 'destructive',
          title: 'Session Expired',
          description: getAppErrorMessage(refreshError || 'AUTH_UNKNOWN_ERROR'),
        });

        return Promise.reject(error);
      }

      const { accessToken, user } = data;
      useAuthStore.getState().setAuth(user, accessToken);

      prevRequest.headers = new AxiosHeaders(prevRequest.headers);
      prevRequest.headers.set('Authorization', `Bearer ${accessToken}`);

      return axiosPrivate(prevRequest);
    }
    return Promise.reject(error);
  }
);
