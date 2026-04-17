import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

import { format } from 'date-fns';
import { X } from 'lucide-react';

import { ProjectSelect } from './ProjectSelect';
import { HoursInput } from './HoursInput';
import { DescriptionField } from './DescriptionField';
import { ModalFooter } from './ModalFooter';
import { useLogTimeForm } from '../../hooks/useLogTimeForm';
import { useDialogStore } from '../../store/useDialogStore';
import { useProjects } from '../../hooks/useProjects';
import { DialogType } from '../../types/timeLogs';

export const LogTimeModal = () => {
  const { activeDialog, dialogData, closeDialog } = useDialogStore();
  const isOpen = activeDialog === DialogType.TRACK_TIME;
  const { data: allProjects = [] } = useProjects(isOpen);
  const { date, log } = dialogData;

  const targetDate = log?.date ?? date ?? '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    onSubmit,
    isSaving,
    reset,
  } = useLogTimeForm(log, targetDate, closeDialog);

  const handleClose = () => {
    reset();
    closeDialog();
  };

  if (!isOpen || !targetDate) return null;

  const displayDate = format(new Date(targetDate), 'EEEE, MMM d');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none rounded-[12px] bg-white shadow-2xl [&>button]:hidden">
        <DialogHeader className="border-b border-[#E0E1E2] px-5 pt-4 pb-4">
          <div className="flex justify-between items-center ">
            <div>
              <DialogTitle className="text-[22px] font-semibold text-gray-900">
                Log time
              </DialogTitle>
              <DialogDescription className="sr-only">
                Create or edit time log for selected date
              </DialogDescription>
              <p className="text-[16px] text-gray-500 mt-1">{displayDate}</p>
            </div>

            <DialogClose className="rounded-full p-1 opacity-70 hover:opacity-100 cursor-pointer">
              <X className="h-6 w-6 text-[#1F1F1F]" />
            </DialogClose>
          </div>
        </DialogHeader>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <ProjectSelect control={control} errors={errors} projects={allProjects} />

          <HoursInput register={register} errors={errors} />

          <DescriptionField register={register} errors={errors} />

          <ModalFooter onClose={handleClose} isSaving={isSaving} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
