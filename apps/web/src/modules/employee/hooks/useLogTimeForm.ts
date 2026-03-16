import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLogMutation, useUpdateLogMutation } from '../hooks/useMutations';
import type { TimeLog } from '../types/timeLogs';
import { useToast } from '@hooks/use-toast';
import { useLayoutEffect } from 'react';
import { getModalErrorMessage } from '@/shared/utils/getModalErrorMessage';

const logTimeSchema = z.object({
  project: z.string().min(1, 'Please select a project'),
  hours: z.coerce
    .number({
      error: 'Please enter a valid amount of hours in range 0.1-24',
    })
    .min(0.1, 'Minimum is 0.1 hours')
    .max(24, 'Cannot exceed 24 hours'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

export type LogTimeFormInput = z.input<typeof logTimeSchema>;
export type LogTimeFormOutput = z.output<typeof logTimeSchema>;

export const useLogTimeForm = (
  log: TimeLog | undefined,
  targetDate: string,
  onSuccess: () => void
) => {
  const { toast } = useToast();
  const createLogMutation = useCreateLogMutation();
  const updateLogMutation = useUpdateLogMutation();

  const form = useForm<LogTimeFormInput, unknown, LogTimeFormOutput>({
    resolver: zodResolver(logTimeSchema),
    defaultValues: {
      project: log?.projectId || '',
      hours: log ? Number(log.hours) : 0,
      description: log?.description || '',
    },
  });

  const { reset } = form;

  useLayoutEffect(() => {
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

  const onSubmit: SubmitHandler<LogTimeFormOutput> = data => {
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
              description: getModalErrorMessage(error),
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
              description: getModalErrorMessage(error),
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
