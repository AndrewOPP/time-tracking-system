import axios from 'axios';

export const getModalErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return 'Something went wrong';

  const message = error.response?.data?.message;

  return message || 'Something went wrong';
};
