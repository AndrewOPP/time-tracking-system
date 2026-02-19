export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;

  isInitializing: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;

  setIsInitializing: (value: boolean) => void;
}
