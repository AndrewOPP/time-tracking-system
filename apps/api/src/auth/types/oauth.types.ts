export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  profileUrl: string;
  useFormData: boolean;
}

export enum Role {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
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

export enum AuthProviders {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  DISCORD = 'DISCORD',
}

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

export const JWT_CONFIG = {
  ACCESS_EXPIRES: '15m',
  REFRESH_EXPIRES: '7d',
  REFRESH_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
} as const;

export enum CookieName {
  REFRESH_TOKEN = 'refreshToken',
}

export enum AuthError {
  MODERATION = 'AUTH_MODERATION_REQUIRED',
  SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  ACCESS_DENIED = 'AUTH_ACCESS_DENIED',
  TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  TOKEN_NOT_FOUND = 'AUTH_TOKEN_NOT_FOUND',
  INVALID_PROVIDER = 'AUTH_INVALID_PROVIDER',
  AUTHORIZATION_REQUIRED = 'AUTH_CODE_REQUIRED',
  INVALID_AUTH_CODE = 'AUTH_INVALID_CODE',
  INCOMPLETE_PROFILE = 'AUTH_INCOMPLETE_PROFILE',
}

export const AUTH_ERROR_MESSAGES = {
  ENV_MISSING: (key: string) => `Environment variable ${key} is not defined`,
  PROVIDER_NOT_CONFIGURED: (provider: string) => `OAuth provider ${provider} is not configured`,

  TOKEN_RETRIEVAL_FAILED: (details: string) => `AUTH_TOKEN_ERROR: ${details}`,
  OAUTH_REQUEST_FAILED: (message: string) => `AUTH_REQUEST_FAILED: ${message}`,
  OAUTH_UNKNOWN_ERROR: (error: string) => `AUTH_UNKNOWN_ERROR: ${error}`,
  PROFILE_FETCH_FAILED: (provider: string, error: string) =>
    `AUTH_PROFILE_ERROR: ${provider} ${error}`,
};
