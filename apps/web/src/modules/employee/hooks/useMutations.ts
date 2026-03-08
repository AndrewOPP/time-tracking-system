import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logDelete, logUpdate } from '../api/myTimeLogs.api';
import type { TimeLog } from '../types/timeLogs';

export const useUpdateLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logUpdate,
    onSuccess: updatedLog => {
      queryClient.setQueriesData({ queryKey: ['timeLogs'] }, (oldData: TimeLog[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map(log => {
          if (log.id === updatedLog.id) {
            return {
              ...log,
              ...updatedLog,
            };
          }

          return log;
        });
      });
    },
  });
};

export const useDeleteLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logDelete,
    onSuccess: deletedLog => {
      queryClient.setQueriesData({ queryKey: ['timeLogs'] }, (oldData: TimeLog[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.filter(log => deletedLog.id !== log.id);
      });
    },
  });
};
