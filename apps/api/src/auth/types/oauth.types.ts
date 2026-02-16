export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  useFormData: boolean;
}

export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  DISCORD: 'discord',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
