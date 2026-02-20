import { AUTH_ERROR_MAP, AUTH_UI_FALLBACKS } from '../constants/errors.messages';

export const getAuthErrorMessage = (error: string): string => {
  if (!error) return AUTH_UI_FALLBACKS.UNKNOWN;

  if (!error.startsWith('AUTH_')) {
    return AUTH_UI_FALLBACKS.INTERNAL;
  }

  const [errorCode] = error.split(':');

  return AUTH_ERROR_MAP[errorCode] || AUTH_UI_FALLBACKS.DEFAULT_AUTH_FAILED;
};
