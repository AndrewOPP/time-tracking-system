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
  AUTH_NO_PERMISSION: 'You do not have permissions to visit this page',
  AUTH_LOGOUT_FAILED: 'Logout error, try again',
  AUTH_DEFAULT_FAILED: 'Login error, try again',
  AUTH_REFRESH_FAILED: 'Auth refresh failed, try again',
};

export const AUTH_UI_FALLBACKS: Record<string, string> = {
  UNKNOWN: 'An unknown error occurred',
  INTERNAL: 'Internal Server Error. Please try again later.',
  DEFAULT_AUTH_FAILED: 'Authentication failed. Please try again.',
};

export const PROJECT_ERROR_MAP: Record<string, string> = {
  PROJECT_LIST_FETCH_FAILED: 'Failed to load project list. Please try again.',
  PROJECT_NOT_FOUND: 'The requested project was not found.',
  PROJECT_ACCESS_DENIED: 'You do not have access to this project.',
  PROJECT_DETAILS_FETCH_FAILED: 'Error occurred while fetching project details.',
};
