import axios from 'axios';
import type { AuthPayload, AuthProvider } from '../types/auth.types';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
});

export const loginWithProvider = async (provider: AuthProvider, payload: AuthPayload) => {
  try {
    const { data } = await api.post(`/auth/${provider}`, payload);
    return data;
  } catch (error) {
    console.log(`Error with ${provider} auth:`, error);
    throw error;
  }
};
