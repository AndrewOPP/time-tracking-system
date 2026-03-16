import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLogBulk } from '../api/project.api';

export const useCreateBulkLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLogBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timeLogs'],
      });
    },
  });
};
