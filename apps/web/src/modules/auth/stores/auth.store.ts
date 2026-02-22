import type { AuthState } from '@/shared/types/user';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  devtools(
    set => ({
      accessToken: null,
      user: null,
      intendedUrl: null,
      isInitializing: true,
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

      setIsInitializing: (value: boolean) =>
        set({
          isInitializing: value,
        }),

      setIntendedUrl: (value: string) =>
        set({
          intendedUrl: value,
        }),
    }),
    { name: 'auth-storage' }
  )
);
