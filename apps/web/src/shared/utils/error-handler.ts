import { AUTH_ERROR_MAP, PROJECT_ERROR_MAP } from '../constants/errors.messages';

const GLOBAL_ERROR_MAP: Record<string, string> = {
  ...AUTH_ERROR_MAP,
  ...PROJECT_ERROR_MAP,
};

export const getAppErrorMessage = (error: string | null | undefined): string => {
  if (!error) return 'An unknown error occurred.';

  if (!error.startsWith('AUTH_') && !error.startsWith('PROJECT_')) {
    return 'An internal server error occurred.';
  }

  const [errorCode] = error.split(':');

  return GLOBAL_ERROR_MAP[errorCode] || 'Operation failed. Please try again.';
};
