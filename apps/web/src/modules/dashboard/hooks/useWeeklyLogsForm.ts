import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLayoutEffect, useRef } from 'react';
import { useCreateBulkLogMutation } from './useMutations';
import { toast } from '@hooks/use-toast';
import { getModalErrorMessage } from '@/shared/utils/getModalErrorMessage';

const dailyLogSchema = z
  .object({
    date: z.string(),
    hours: z
      .union([z.coerce.number().min(0.1, 'Mix 0.1h').max(24, 'Max 24h'), z.literal('')])
      .optional(),
    description: z.string().optional(),
    id: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasHours = typeof data.hours === 'number';
    const descText = data.description?.trim() || '';
    const hasDescription = descText.length > 0;

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
export type DailyLogDraft = WeeklyLogFormInput['days'][number];

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

  const draftsRef = useRef<Record<string, DailyLogDraft>>({});

  const form = useForm<WeeklyLogFormInput, unknown, WeeklyLogFormOutput>({
    resolver: zodResolver(weeklyLogSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldFocusError: false,
  });

  const { reset, getValues } = form;

  const saveCurrentToDrafts = () => {
    const currentDays = getValues('days');
    if (currentDays) {
      currentDays.forEach(day => {
        const hasHours = day.hours !== '' && day.hours !== undefined;
        const hasDesc = !!day.description?.trim();

        if (hasHours || hasDesc) {
          draftsRef.current[day.date] = day;
        } else {
          delete draftsRef.current[day.date];
        }
      });
    }
  };

  const clearDrafts = () => {
    draftsRef.current = {};
  };

  useLayoutEffect(() => {
    reset({
      projectId: projectId,
      days: groupedLogsByDays.map(day => {
        const draft = draftsRef.current[day.fullDate];

        if (draft) return draft;

        return {
          id: day.entries[0]?.id || '',
          date: day.fullDate,
          hours: day.totalHours || '',
          description: day.entries[0]?.description || '',
        };
      }),
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
      clearDrafts();
      onSuccess();
      return;
    }

    createBulkLogMutation.mutate(
      { createBulkLogs: logsToSubmit, projectId },
      {
        onSuccess: () => {
          clearDrafts();
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

  const handleFormSubmit = (e?: React.BaseSyntheticEvent) => {
    return form.handleSubmit(onSubmit)(e);
  };

  return {
    ...form,
    saveCurrentToDrafts,
    clearDrafts,
    onSubmit: handleFormSubmit,
  };
};
