import type { AuthPayload, AuthProvider } from '../types/auth.types';
import { axiosPrivate, axiosPublic } from '@/shared/api';

export const loginWithProvider = async (provider: AuthProvider, payload: AuthPayload) => {
  try {
    const { data } = await axiosPublic.post(`/auth/${provider}`, payload);
    return data;
  } catch (error) {
    console.log(`Error with ${provider} auth:`, error);
    throw error;
  }
};
export const logOut = async () => {
  try {
    const { data } = await axiosPrivate.post(`/auth/logout`);
    return data;
  } catch (error) {
    console.log(`Error with logout:`, error);
    throw error;
  }
};
