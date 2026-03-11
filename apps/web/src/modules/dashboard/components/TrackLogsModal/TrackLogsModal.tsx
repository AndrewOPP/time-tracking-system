import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { X } from 'lucide-react';
import { useDialogStore } from '../../store/useDialogStore';
import { WeekNavigation } from '@/modules/employee/components/WeekNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useWeekRange } from '@/modules/employee/hooks/useWeekRange';
import { useWeekNavigation } from '@/modules/employee/hooks/useWeekNavigation';
import { useLogDates } from '@/modules/employee/hooks/useLogDates';
import { format } from 'date-fns';
import { groupLogsToDays } from '@/modules/employee/utils/groupLogs';
import { useWeeklyLogsForm } from '../../hooks/useWeeklyLogsForm';
import TrackLogModalDay from './TrackLogModalDay';
import TrackLogModalFooter from './TrackLogModalFooter';

interface TrackLogsModalProps {
  projectName: string;
  projectId: string;
}

export default function TrackLogsModal({ projectName, projectId }: TrackLogsModalProps) {
  const { isOpen, closeDialog } = useDialogStore();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  const activeDate = useMemo(() => (dateParam ? new Date(dateParam) : new Date()), [dateParam]);
  const { weekStart, weekEnd, weekRangeLabel } = useWeekRange(activeDate);
  const { handlePrevWeek, handleNextWeek } = useWeekNavigation(activeDate);

  const fromStr = format(weekStart, 'yyyy-MM-dd');
  const toStr = format(weekEnd, 'yyyy-MM-dd');

  const { timeLogs } = useLogDates(fromStr, toStr, projectId);

  const groupedLogsByDays = useMemo(() => {
    return groupLogsToDays(fromStr, toStr, timeLogs || [], 'long');
  }, [fromStr, toStr, timeLogs]);

  const {
    register,
    onSubmit,
    watch,
    formState: { errors },
    reset,
    clearErrors,
  } = useWeeklyLogsForm(groupedLogsByDays, projectId, closeDialog);

  const formDays = watch('days');
  const totalWeekHours = formDays?.reduce((sum, day) => sum + (Number(day.hours) || 0), 0) || 0;

  const handleClose = () => {
    reset();
    closeDialog();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:min-w-[800px] p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="border-b border-[#E0E1E2] py-4 px-6 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-[22px] font-semibold text-gray-900">
              Tracking hours
            </DialogTitle>
            <p>{projectName}</p>
          </div>
          <DialogDescription className="sr-only">
            Delete time log for selected date
          </DialogDescription>
          <DialogClose className="rounded-full p-1 opacity-70 hover:opacity-100 cursor-pointer">
            <X className="h-6 w-6 text-[#1F1F1F]" />
          </DialogClose>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col">
          <div>
            <div className="px-6 pt-4 pb-1 flex justify-center">
              <WeekNavigation
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
                weekRangeText={weekRangeLabel}
              />
            </div>

            <div className="px-6 flex flex-col gap-0">
              {groupedLogsByDays.map((day, index) => (
                <TrackLogModalDay
                  key={day.fullDate}
                  index={index}
                  day={day}
                  register={register}
                  errors={errors}
                  currentHours={Number(formDays?.[index]?.hours) || 0}
                  clearErrors={clearErrors}
                />
              ))}
            </div>

            <TrackLogModalFooter totalHours={totalWeekHours} handleClose={handleClose} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
