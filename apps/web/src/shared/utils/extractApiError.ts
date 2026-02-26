import { isAxiosError } from 'axios';

export const extractApiError = (
  err: unknown,
  defaultFallback: string = 'UNKNOWN_ERROR'
): string => {
  if (isAxiosError(err)) {
    const message = err.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message || defaultFallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return defaultFallback;
};
