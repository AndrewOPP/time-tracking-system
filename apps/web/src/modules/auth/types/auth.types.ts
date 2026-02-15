export const AUTH_STORAGE_KEYS = {
  STATE: 'oauth_state',
  PROVIDER: 'oauth_provider',
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
    CANCELED: 'Authorization cancelled',
  },
} as const;

export const AUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  DISCORD: 'discord',
} as const;

export type OAuthEventType = (typeof OAUTH_EVENT_TYPES)[keyof typeof OAUTH_EVENT_TYPES];
export type AuthStorageKey = (typeof AUTH_STORAGE_KEYS)[keyof typeof AUTH_STORAGE_KEYS];
export type AuthProvider = (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];
export type AuthNotification =
  (typeof AUTH_NOTIFICATIONS.CONTENT)[keyof typeof AUTH_NOTIFICATIONS.CONTENT];

export interface AuthPayload {
  code?: string;
  token?: string;
}

export interface OAuthLoginButtonProps {
  provider: AuthProvider;
}

export type OAuthProviderConfig = {
  clientId: string;
  scope: string;
  authUrl: string;
  extraParams?: string;
};
