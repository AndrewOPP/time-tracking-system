export enum OAuthProvider {
  GITHUB = 'github',
  DISCORD = 'discord',
  LINKEDIN = 'linkedin',
  GOOGLE = 'google',
}

export type OAuthConfig = {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
};
