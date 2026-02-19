import type { AuthState, AuthStatus } from '@/shared/types/user';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  devtools(
    set => ({
      accessToken: null,
      user: null,
      isInitializing: true,
      intendedUrl: null,
      status: 'loading',
      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isInitializing: false,
        }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          intendedUrl: null,
          isInitializing: false,
        }),

      setIntendedUrl: (url: string) =>
        set({
          intendedUrl: url,
        }),
      setIsInitializing: (value: boolean) =>
        set({
          isInitializing: value,
        }),
      setStatus: (status: AuthStatus) =>
        set({
          status: status,
        }),
    }),
    { name: 'auth-storage' }
  )
);
