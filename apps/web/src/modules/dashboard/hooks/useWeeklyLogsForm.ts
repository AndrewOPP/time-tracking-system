import * as z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLayoutEffect } from 'react';

const dailyLogSchema = z.object({
  date: z.string(),
  hours: z.coerce.number().optional(),
  description: z.string().optional(),
});

const weeklyLogSchema = z.object({
  projectId: z.string().optional(),
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
  const form = useForm<WeeklyLogFormInput, unknown, WeeklyLogFormOutput>({
    resolver: zodResolver(weeklyLogSchema),
    defaultValues: {
      projectId: projectId || '',
      days: groupedLogsByDays.map(day => ({
        date: day.fullDate,
        hours: day.totalHours || '',
        description: day.entries[0]?.description || '',
      })),
    },
  });

  const { reset } = form;

  useLayoutEffect(() => {
    reset({
      projectId: projectId || '',
      days: groupedLogsByDays.map(day => ({
        date: day.fullDate,
        hours: day.totalHours || '',
        description: day.entries[0]?.description || '',
      })),
    });
  }, [groupedLogsByDays, projectId, reset]);

  const onSubmit: SubmitHandler<WeeklyLogFormOutput> = data => {
    console.log('--- Данные формы при сабмите ---', data);
    onSuccess();
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
