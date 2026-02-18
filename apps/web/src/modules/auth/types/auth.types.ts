import { DiscordIcon, GithubIcon, GoogleIcon, LinkedInIcon } from '@components/ui/icons';

export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  DISCORD: 'discord',
} as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const AUTH_STORAGE_KEYS = {
  STATE: 'oauth_state',
  PROVIDER: 'oauth_provider',
  PKCE_VERIFIER: 'oauth_provider',
} as const;

export const OAUTH_EVENT_TYPES = {
  SUCCESS: 'oauth_success',
  ERROR: 'oauth_error',
} as const;

export const AUTH_NOTIFICATIONS = {
  CONTENT: {
    SUCCESS: 'Authorization successful! Welcome.',
    ERROR: 'Authorization failed. Please try again.',
    LOADING: 'Processing authorization...',
    CANCELED: 'Authorization cancelled by user',
  },
} as const;

export const OAUTH_LIST = [
  { provider: AUTH_PROVIDERS.GOOGLE, icon: GoogleIcon },
  { provider: AUTH_PROVIDERS.DISCORD, icon: DiscordIcon },
  { provider: AUTH_PROVIDERS.GITHUB, icon: GithubIcon },
  { provider: AUTH_PROVIDERS.LINKEDIN, icon: LinkedInIcon },
] as const;

export type OAuthEventType = (typeof OAUTH_EVENT_TYPES)[keyof typeof OAUTH_EVENT_TYPES];
export type AuthStorageKey = (typeof AUTH_STORAGE_KEYS)[keyof typeof AUTH_STORAGE_KEYS];

export type AuthNotification =
  (typeof AUTH_NOTIFICATIONS.CONTENT)[keyof typeof AUTH_NOTIFICATIONS.CONTENT];

export interface AuthPayload {
  code?: string;
  token?: string;
  code_verifier?: string;
}

export type OAuthProviderConfig = {
  clientId: string;
  scope: string;
  authUrl: string;
  extraParams?: string;
};

export interface OAuthLoginButtonProps {
  provider: AuthProvider;
  setGlobalLoading: (v: boolean) => void;
  isGlobalLoading: boolean;
  className?: string;
  icon?: string;
  children?: React.ReactNode;
}

export interface BuildOAuthUrlParams {
  authUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  extraParams?: string;
}

export interface AuthNestApiError {
  message: string;
  error?: string;
  statusCode: number;
}
