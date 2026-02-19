export interface User {
  id: string;
  email: string;
  role: string;
}
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  status: AuthStatus;
  intendedUrl: string | null;
  isInitializing: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setStatus: (status: AuthStatus) => void;
  setIntendedUrl: (url: string | null) => void;
  setIsInitializing: (value: boolean) => void;
}
