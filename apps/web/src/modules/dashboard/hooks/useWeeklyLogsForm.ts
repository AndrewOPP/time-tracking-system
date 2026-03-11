import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLayoutEffect } from 'react';
import { useCreateBulkLogMutation } from './useMutations';
import { toast } from '@hooks/use-toast';
import { getModalErrorMessage } from '@/shared/utils/getModalErrorMessage';

const dailyLogSchema = z
  .object({
    date: z.string(),
    hours: z.union([z.coerce.number(), z.literal('')]).optional(),
    description: z.string().optional(),
    id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hoursValue = Number(data.hours) || 0;
    const descText = data.description?.trim() || '';

    const hasHours = hoursValue > 0;
    const hasDescription = descText.length > 0;

    if (hoursValue > 24) {
      ctx.addIssue({
        code: 'custom',
        message: 'Max 24h',
        path: ['hours'],
      });
    }

    if (!hasHours && !hasDescription) {
      return;
    }

    if (hasDescription && !hasHours) {
      ctx.addIssue({
        code: 'custom',
        message: 'Required',
        path: ['hours'],
      });
      return;
    }

    if (hasHours) {
      if (!hasDescription) {
        ctx.addIssue({
          code: 'custom',
          message: 'Required',
          path: ['description'],
        });
      } else if (descText.length < 3) {
        ctx.addIssue({
          code: 'custom',
          message: 'Min 3 chars',
          path: ['description'],
        });
      }
    }
  });

const weeklyLogSchema = z.object({
  projectId: z.string(),
  days: z.array(dailyLogSchema),
});

export type WeeklyLogFormInput = z.input<typeof weeklyLogSchema>;
export type WeeklyLogFormOutput = z.output<typeof weeklyLogSchema>;

type GroupedDay = {
  fullDate: string;
  totalHours: number;
  entries: Array<{ id: string; description: string; hours: number }>;
};

export const useWeeklyLogsForm = (
  groupedLogsByDays: GroupedDay[],
  projectId: string,
  onSuccess: () => void
) => {
  const createBulkLogMutation = useCreateBulkLogMutation();

  const form = useForm<WeeklyLogFormInput, unknown, WeeklyLogFormOutput>({
    resolver: zodResolver(weeklyLogSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      projectId: projectId,
      days: groupedLogsByDays.map(day => ({
        id: day.entries[0]?.id || '',
        date: day.fullDate,
        hours: day.totalHours || '',
        description: day.entries[0]?.description || '',
      })),
    },
  });

  const { reset } = form;

  useLayoutEffect(() => {
    reset({
      projectId: projectId,
      days: groupedLogsByDays.map(day => ({
        id: day.entries[0]?.id || '',
        date: day.fullDate,
        hours: day.totalHours || '',
        description: day.entries[0]?.description || '',
      })),
    });
  }, [groupedLogsByDays, projectId, reset]);

  const onSubmit: SubmitHandler<WeeklyLogFormOutput> = data => {
    const logsToSubmit = data.days
      .filter(day => {
        const hasHours = Number(day.hours) > 0;
        const hasDesc = !!day.description?.trim();
        const isExistingLog = !!day.id;

        return (hasHours && hasDesc) || isExistingLog;
      })
      .map(day => {
        const hasHours = Number(day.hours) > 0;
        const hasDesc = !!day.description?.trim();

        const isIntendedDeletion = !!day.id && (!hasHours || !hasDesc);

        return {
          ...day,
          hours: isIntendedDeletion ? 0 : Number(day.hours),
          description: isIntendedDeletion ? '' : day.description || '',
          id: day.id || undefined,
        };
      });

    if (logsToSubmit.length === 0) {
      onSuccess();
      return;
    }

    createBulkLogMutation.mutate(
      { createBulkLogs: logsToSubmit, projectId },
      {
        onSuccess: () => {
          toast({
            variant: 'default',
            title: 'Logs have been updated',
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
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
