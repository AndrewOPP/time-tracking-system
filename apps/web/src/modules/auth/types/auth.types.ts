export type AuthProvider = 'github' | 'google' | 'discord' | 'linkedin';

export interface AuthPayload {
  code?: string;
  token?: string;
}
