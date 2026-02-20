export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
}
