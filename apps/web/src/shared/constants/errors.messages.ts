export const AUTH_ERROR_MAP: Record<string, string> = {
  AUTH_MODERATION_REQUIRED: 'Your account is under moderation. Please contact the administrator.',
  AUTH_SESSION_EXPIRED: 'Session expired. Please login again.',
  AUTH_ACCESS_DENIED: 'Access Denied',
  AUTH_TOKEN_EXPIRED: 'Token expired or invalid',
  AUTH_TOKEN_NOT_FOUND: 'Token not found, login again',
  AUTH_INVALID_PROVIDER: 'Invalid OAuth provider',
  AUTH_CODE_REQUIRED: 'Authorization code is required',
  AUTH_INVALID_CODE: 'Invalid authorization code',
  AUTH_INCOMPLETE_PROFILE: 'Incomplete profile from provider',
  AUTH_TOKEN_ERROR: 'Failed to retrieve access token',
  AUTH_REQUEST_FAILED: 'OAuth request failed',
  AUTH_PROFILE_ERROR: 'Failed to fetch user profile',
};
