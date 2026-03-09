import { useEffect } from 'react';
import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLogMutation, useUpdateLogMutation } from '../hooks/useMutations';
import type { TimeLog } from '../types/timeLogs';
import { useToast } from '@hooks/use-toast';
import axios from 'axios';

const logTimeSchema = z.object({
  project: z.string().min(1, 'Please select a project'),
  hours: z
    .number({ error: 'Please enter a valid amount of hours in range 0.5-24' })
    .min(0.5, 'Minimum is 0.5 hours')
    .max(24, 'Cannot exceed 24 hours'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

export type LogTimeFormValues = z.infer<typeof logTimeSchema>;

export const useLogTimeForm = (
  log: TimeLog | undefined,
  targetDate: string,
  onSuccess: () => void
) => {
  const { toast } = useToast();
  const createLogMutation = useCreateLogMutation();
  const updateLogMutation = useUpdateLogMutation();

  const form = useForm<LogTimeFormValues>({
    resolver: zodResolver(logTimeSchema),
    defaultValues: {
      project: '',
      hours: 0,
      description: '',
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (log) {
      reset({
        project: log.projectId,
        hours: Number(log.hours),
        description: log.description,
      });
    } else {
      reset({
        project: '',
        hours: 0,
        description: '',
      });
    }
  }, [log, reset]);

  const getErrorMessage = (error: unknown): string => {
    if (!axios.isAxiosError(error)) return 'Something went wrong';

    const message = error.response?.data?.message;

    return message || 'Something went wrong';
  };

  const onSubmit: SubmitHandler<LogTimeFormValues> = data => {
    if (log) {
      updateLogMutation.mutate(
        {
          id: log.id,
          updateLog: {
            projectId: data.project,
            hours: data.hours,
            description: data.description,
          },
        },
        {
          onSuccess: () => {
            toast({
              variant: 'default',
              title: 'Log has been updated',
            });

            onSuccess();
          },
          onError: (error: unknown) => {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: getErrorMessage(error),
            });
          },
        }
      );
    } else {
      createLogMutation.mutate(
        {
          projectId: data.project,
          hours: data.hours,
          description: data.description,
          date: targetDate,
        },
        {
          onSuccess: () => {
            toast({
              variant: 'default',
              title: 'Log has been created',
            });
            reset({ project: '', hours: 0, description: '' });
            onSuccess();
          },

          onError: (error: unknown) => {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: getErrorMessage(error),
            });
          },
        }
      );
    }
  };

  const isSaving = createLogMutation.isPending || updateLogMutation.isPending;

  return {
    ...form,
    onSubmit,
    isSaving,
  };
};
