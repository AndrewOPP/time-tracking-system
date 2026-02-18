import { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { axiosPrivate, axiosPublic } from './api-instance';
import { toast } from '@/shared/hooks/use-toast';
import { useAuthStore } from '../../modules/auth/stores/auth.store';

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
        // Сценарій 4: Запит на оновлення токена
        const response = await axiosPublic.get('/auth/refresh', {
          withCredentials: true,
        });
        const { accessToken, user } = response.data;

        // Зберігаємо нові дані в Zustand
        useAuthStore.getState().setAuth(accessToken, user);

        // Оновлюємо заголовок та повторюємо оригінальний запит
        prevRequest.headers = new AxiosHeaders(prevRequest.headers);
        prevRequest.headers.set('Authorization', `Bearer ${accessToken}`);

        return axiosPrivate(prevRequest);
      } catch (refreshError) {
        // Сценарій 5: Рефреш токен прострочений або невалідний

        useAuthStore.getState().clearAuth();
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
        });
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
