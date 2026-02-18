export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  profileUrl: string;
  useFormData: boolean;
}

export interface IOAuthProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  global_name?: string;
  username?: string;
  sub?: string;
  avatar_url?: string;
  login?: string;
  avatar?: string;
}
export interface IOAuthNormalizeProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// export const AUTH_PROVIDERS = {
//   GOOGLE: 'GOOGLE',
//   GITHUB: 'GITHUB',
//   LINKEDIN: 'LINKEDIN',
//   DISCORD: 'DISCORD',
// } as const;

// export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export enum AuthProviders {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  DISCORD = 'DISCORD',
}
