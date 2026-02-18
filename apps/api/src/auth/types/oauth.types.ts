export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  useFormData: boolean;
}

export enum AuthProviders {
  GOOGLE = 'google',
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  DISCORD = 'discord',
}
