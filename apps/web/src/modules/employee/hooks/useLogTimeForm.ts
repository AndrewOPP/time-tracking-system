import { useEffect } from 'react';
import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLogMutation, useUpdateLogMutation } from '../hooks/useMutations';
import type { TimeLog } from '../types/timeLogs';

const logTimeSchema = z.object({
  project: z.string().min(1, 'Please select a project'),
  hours: z
    .number({ error: 'Please enter a valid amount of hours' })
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
        { onSuccess }
      );
    } else {
      createLogMutation.mutate(
        {
          projectId: data.project,
          hours: data.hours,
          description: data.description,
          date: targetDate,
        },
        { onSuccess }
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
