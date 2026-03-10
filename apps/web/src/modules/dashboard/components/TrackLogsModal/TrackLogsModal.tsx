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

export default function TrackLogsModal() {
  const { isOpen, closeDialog } = useDialogStore();

  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  const activeDate = useMemo(() => (dateParam ? new Date(dateParam) : new Date()), [dateParam]);

  const { weekStart, weekEnd, weekRangeLabel } = useWeekRange(activeDate);
  const { handlePrevWeek, handleNextWeek } = useWeekNavigation(activeDate);

  const fromStr = format(weekStart, 'yyyy-MM-dd');
  const toStr = format(weekEnd, 'yyyy-MM-dd');

  const { timeLogs } = useLogDates(fromStr, toStr);

  const groupedLogsByDays = useMemo(() => {
    return groupLogsToDays(fromStr, toStr, timeLogs || [], 'long');
  }, [fromStr, toStr, timeLogs]);

  const { register, onSubmit, watch } = useWeeklyLogsForm(
    groupedLogsByDays,
    'mock-project-id',
    closeDialog
  );

  const formDays = watch('days');
  const totalWeekHours = formDays?.reduce((sum, day) => sum + (Number(day.hours) || 0), 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:min-w-[800px] p-0 gap-0 [&>button]:hidden">
        <DialogHeader className="  border-b border-[#E0E1E2] py-4 px-6 flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-[22px] font-semibold text-gray-900 ">
              Tracking hours
            </DialogTitle>
            <p>Project name</p>
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
            <div className=" px-6 pt-4 pb-1 flex  justify-center">
              <WeekNavigation
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
                weekRangeText={weekRangeLabel}
              />
            </div>

            <div className="px-6 flex flex-col gap-0">
              {groupedLogsByDays.map((day, index) => {
                const isWeekend = day.dayName === 'Saturday' || day.dayName === 'Sunday';

                const currentHours = Number(formDays?.[index]?.hours) || 0;
                const hasHours = currentHours > 0;

                const dotColor = hasHours ? 'bg-[#4E916B]' : 'bg-[#6F6F6F]';
                const dotWeekendColor = isWeekend ? 'bg-[#d1d1d1]' : dotColor;

                const dayColor = isWeekend ? 'text-[#6F6F6F]' : 'text-[#1F1F1F]';

                const commentPlaceholder = isWeekend
                  ? 'Add a comment if needed. Thank you for your time and contribution!'
                  : 'Add a comment (describe the work done)';

                return (
                  <div
                    key={day.fullDate}
                    className="flex items-center gap-2  pb-4 pt-4 border-b border-[#E5E7EB]"
                  >
                    <div className="w-[110px] flex items-start gap-2 shrink-0 ">
                      <div
                        className={`mt-[4px] w-[8px] h-[8px] rounded-full shrink-0  ${dotColor} ${dotWeekendColor}`}
                      />
                      <div className="flex flex-col pt-0">
                        <span className={`text-[16px] font-semibold leading-none ${dayColor}`}>
                          {day.dayName}
                        </span>
                        <span className="text-[12px] text-[#6F6F6F] leading-none">
                          {day.dateStr}
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="0.0"
                      autoComplete="off"
                      {...register(`days.${index}.hours` as const)}
                      className="w-[36px] h-[36px] border border-[#E0E1E2] rounded-md text-center text-[14px] text-[#1F2937] placeholder:text-[#D1D5DB] outline-none focus:border-[#9c9c9c] shrink-0 bg-transparent"
                    />

                    <input
                      type="text"
                      autoComplete="off"
                      placeholder={commentPlaceholder}
                      {...register(`days.${index}.description` as const)}
                      className="flex-1 h-[36px] border border-[#E0E1E2] rounded-md px-4 py-2 text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#9c9c9c] min-w-0 bg-transparent"
                    />
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6 pt-5 flex justify-end items-center gap-2">
              <span className="text-[14px] font-semibold text-[#6B7280]">Total for the week:</span>
              <span className="text-[16px] font-semibold text-[#1F2937]">
                {totalWeekHours > 0 ? totalWeekHours.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>

          <div className="bg-[#F9FAFB] border-t border-[#E0E1E2] flex justify-end gap-3 py-5 px-6">
            <button
              type="button"
              onClick={closeDialog}
              className="w-[93px] bg-[#ffffff] px-4 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-[#fcfcfc] transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-[93px] px-4 py-2 rounded-md bg-[#4E916B] text-white cursor-pointer hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
