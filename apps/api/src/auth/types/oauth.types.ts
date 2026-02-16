export enum OAuthProvider {
  GITHUB = 'github',
  DISCORD = 'discord',
  LINKEDIN = 'linkedin',
  GOOGLE = 'google',
}

export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  useFormData: boolean;
}
