import type { AuthProvider, OAuthProviderConfig } from '../types/auth.types';

export const oauthConfig: Record<AuthProvider, OAuthProviderConfig> = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: 'openid profile email',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    extraParams: '&access_type=offline&prompt=consent',
  },
  discord: {
    clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
    scope: 'identify email',
    authUrl: 'https://discord.com/oauth2/authorize',
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    scope: 'openid profile email',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    scope: 'read:user user:email',
    authUrl: 'https://github.com/login/oauth/authorize',
  },
};
