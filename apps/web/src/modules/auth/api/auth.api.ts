import type { AuthPayload, AuthProvider } from '../types/auth.types';
import { axiosPrivate, axiosPublic } from '@/shared/api';

export const loginWithProvider = async (provider: AuthProvider, payload: AuthPayload) => {
  try {
    const { data } = await axiosPublic.post(`/auth/${provider}`, payload);
    return data;
  } catch (error) {
    console.error(`Login with ${provider} failed:`, error);
  }
};

export const logOut = async () => {
  try {
    const { data } = await axiosPrivate.post(`/auth/logout`);
    return data;
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const tokenRefresh = async () => {
  try {
    const response = await axiosPublic.get('/auth/refresh', {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
};
