import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useDialogStore } from '../store/useDialogStore';
import { useDeleteLogMutation } from '../hooks/useMutations';
import { X } from 'lucide-react';
import { useToast } from '@hooks/use-toast';
import { DialogType } from '../types/timeLogs';

export const DeleteTimeLogModal = () => {
  const { activeDialog, dialogData, closeDialog } = useDialogStore();
  const { toast } = useToast();
  const isOpen = activeDialog === DialogType.DELETE_TIME_LOG;
  const log = dialogData.log;

  const deleteMutation = useDeleteLogMutation();

  if (!isOpen || !log) return null;

  const handleDelete = () => {
    deleteMutation.mutate(
      { id: log.id },
      {
        onSuccess: () => {
          toast({
            variant: 'default',
            title: 'Log has been deleted',
          });
          closeDialog();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[400px] p-0 [&>button]:hidden">
        <DialogHeader className="  border-b border-[#E0E1E2] pb-5 pt-5 px-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-[22px] font-semibold text-gray-900 ">
            Delete time log
          </DialogTitle>
          <DialogDescription className="sr-only">
            Delete time log for selected date
          </DialogDescription>
          <DialogClose className="rounded-full p-1 opacity-70 hover:opacity-100 cursor-pointer">
            <X className="h-6 w-6 text-[#1F1F1F]" />
          </DialogClose>
        </DialogHeader>

        <p className="text-[16px] text-gray-700 mt-4 px-5">
          Are you sure you want to delete this log?
        </p>

        <div className="flex justify-end gap-3 mt-6 mb-5 px-4">
          <button
            onClick={closeDialog}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white cursor-pointer hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
