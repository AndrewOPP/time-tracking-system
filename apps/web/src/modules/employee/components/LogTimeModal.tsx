import { useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { format } from 'date-fns';
import { Briefcase, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import * as z from 'zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLogMutation, useUpdateLogMutation } from '../hooks/useMutations';
import { useDialogStore } from '../store/useDialogStore';

const logTimeSchema = z.object({
  project: z.string().min(1, 'Please select a project'),
  hours: z
    .number({ error: 'Please enter a valid amount of hours' })
    .min(0.5, 'Minimum is 0.5 hours')
    .max(24, 'Cannot exceed 24 hours'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

type LogTimeFormValues = z.infer<typeof logTimeSchema>;

export const LogTimeModal = () => {
  const { activeDialog, dialogData, closeDialog } = useDialogStore();

  const isOpen = activeDialog === 'TRACK_TIME';
  const { date, log } = dialogData;

  const createLogMutation = useCreateLogMutation();
  const updateLogMutation = useUpdateLogMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<LogTimeFormValues>({
    resolver: zodResolver(logTimeSchema),
    defaultValues: { project: '', hours: 0, description: '' },
  });

  useEffect(() => {
    if (isOpen) {
      if (log) {
        reset({
          project: log.projectId,
          hours: Number(log.hours),
          description: log.description,
        });
      } else {
        reset({ project: '', hours: 0, description: '' });
      }
    }
  }, [isOpen, log, reset]);

  const targetDate = log?.date || date;

  if (!isOpen || !targetDate) return null;

  const displayDate = format(new Date(targetDate), 'EEEE, MMM d');

  const onSubmit: SubmitHandler<LogTimeFormValues> = formData => {
    if (log) {
      updateLogMutation.mutate(
        {
          id: log.id,
          updateLog: {
            projectId: formData.project,
            hours: formData.hours,
            description: formData.description,
          },
        },
        { onSuccess: () => closeDialog() }
      );
    } else {
      createLogMutation.mutate(
        {
          projectId: formData.project,
          hours: formData.hours,
          description: formData.description,
          date: targetDate,
        },
        { onSuccess: () => closeDialog() }
      );
    }
  };

  const handleClose = () => {
    reset();
    closeDialog();
  };

  const isSaving = createLogMutation.isPending || updateLogMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-[12px] bg-white shadow-2xl [&>button]:hidden">
        <DialogHeader className="border-b border-[#E0E1E2] px-5 pt-4 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[22px] font-semibold text-gray-900">
                Log time
              </DialogTitle>
              <p className="text-[16px] text-gray-500 mt-1">{displayDate}</p>
            </div>
            <DialogClose className="rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer">
              <X className="h-6 w-6 text-[#1F1F1F]" />
            </DialogClose>
          </div>
        </DialogHeader>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col px-5 pt-5">
            <label className="font-semibold text-[16px] text-gray-900 pb-3">
              Project <span className="text-[#4E916B]">*</span>
            </label>
            <Controller
              name="project"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`cursor-pointer w-full h-[48px] rounded-[12px] border ${errors.project ? 'border-red-500' : 'border-[#D0D5DD]'} bg-white text-[16px] pl-10 relative`}
                  >
                    <Briefcase className="absolute left-3 w-5 h-5 text-[#667085]" />
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    align="start"
                    sideOffset={4}
                    className="rounded-[12px] border border-[#EAECF0] shadow-lg"
                  >
                    <SelectItem
                      className="cursor-pointer"
                      value="3e5d56fb-2b8d-433b-8702-2fb205066702"
                    >
                      Tromp Inc
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <span className="text-red-500 text-sm mt-1 min-h-[20px] block">
              {errors.project?.message}
            </span>
          </div>

          <div className="flex flex-col px-5">
            <label className="font-semibold text-[16px] text-gray-900 pb-3">
              Amount of working hours <span className="text-[#4E916B]">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                step="0.5"
                {...register('hours', { valueAsNumber: true })}
                className={`w-[70px] h-[36px] rounded-[8px] text-center border ${errors.hours ? 'border-red-500' : 'border-[#E0E1E2]'} focus:outline-none focus:ring-1 focus:ring-[#d1d1d1] transition-all`}
              />
              <span className="text-[#6F6F6F] font-medium text-[16px] ml-3">hours</span>
            </div>
            <span className="text-red-500 text-sm mt-1 min-h-[20px] block">
              {errors.hours?.message}
            </span>
          </div>

          <div className="flex flex-col px-5">
            <label className="font-semibold text-[16px] text-gray-900 pb-3">
              Description <span className="text-[#4E916B]">*</span>
            </label>
            <textarea
              placeholder="What did you work on?"
              {...register('description')}
              className={`text-[#6F6F6F] w-full min-h-[140px] p-3 rounded-[8px] border ${errors.description ? 'border-red-500' : 'border-[#E0E1E2]'} resize-none focus:outline-none focus:ring-1 focus:ring-[#d1d1d1] transition-all`}
            />
            <span className="text-red-500 text-sm mt-1 min-h-[20px] block">
              {errors.description?.message}
            </span>
          </div>

          <div className="bg-[#F9FAFB] border-t border-[#E0E1E2] flex justify-end gap-3 pt-4 px-5 pb-4 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-[8px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 font-semibold text-white bg-[#4E916B] hover:bg-[#3d7254] rounded-[8px] transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
