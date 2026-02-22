export interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  intendedUrl: string | null;
  isInitializing: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setIntendedUrl: (value: string | null) => void;
  setIsInitializing: (value: boolean) => void;
}

export const UserSystemRole = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  HR: 'HR',
  ACCOUNTANT: 'ACCOUNTANT',
  ADMIN: 'ADMIN',
} as const;

export type UserSystemRole = (typeof UserSystemRole)[keyof typeof UserSystemRole];
