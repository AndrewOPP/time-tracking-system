import { AUTH_ERROR_MAP } from '../constants/errors.messages';

export const getAuthErrorMessage = (error: string): string => {
  if (!error) return 'An unknown error occurred';

  if (!error.startsWith('AUTH_')) {
    return 'Internal Server Error. Please try again later.';
  }

  const [errorCode] = error.split(':');

  return AUTH_ERROR_MAP[errorCode] || 'Authentication failed. Please try again.';
};
