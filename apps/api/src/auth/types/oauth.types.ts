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
  MODERATION = 'Your account is under moderation. Please contact the administrator.',
  SESSION_EXPIRED = 'Session expired. Please login again.',
  ACCESS_DENIED = 'Access Denied',
}
