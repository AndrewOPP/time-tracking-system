import type { FieldErrors, UseFormRegister, UseFormClearErrors } from 'react-hook-form';
import type { WeeklyLogFormInput } from '../../hooks/useWeeklyLogsForm';
import type { DayGroup } from '@/modules/employee/types/timeLogs';

interface TrackLogModalDayProps {
  index: number;
  day: DayGroup;
  register: UseFormRegister<WeeklyLogFormInput>;
  errors?: FieldErrors<WeeklyLogFormInput>;
  currentHours: number;
  clearErrors: UseFormClearErrors<WeeklyLogFormInput>;
}

export default function TrackLogModalDay({
  index,
  day,
  register,
  errors,
  currentHours,
  clearErrors,
}: TrackLogModalDayProps) {
  const isWeekend = day.dayName === 'Saturday' || day.dayName === 'Sunday';
  const hasHours = currentHours > 0;

  const dotColor = hasHours ? 'bg-[#4E916B]' : 'bg-[#6F6F6F]';
  const dotWeekendColor = isWeekend ? 'bg-[#d1d1d1]' : dotColor;
  const dayColor = isWeekend ? 'text-[#6F6F6F]' : 'text-[#1F1F1F]';

  const commentPlaceholder = isWeekend
    ? 'Add a comment if needed. Thank you for your time and contribution!'
    : 'Add a comment (describe the work done)';

  const dayError = errors?.days?.[index];

  const cleanInputErrors = (value: string) => {
    if (value === '') {
      clearErrors([`days.${index}.hours`, `days.${index}.description`]);
    } else {
      if (dayError?.hours) clearErrors(`days.${index}.hours`);
      if (dayError?.description) clearErrors(`days.${index}.description`);
    }
  };

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="flex items-center gap-2 pb-4 pt-4 border-b border-[#E5E7EB]">
        <div className="w-[110px] flex items-start gap-2 shrink-0">
          <div className={`mt-[4px] w-[8px] h-[8px] rounded-full shrink-0 ${dotWeekendColor}`} />
          <div className="flex flex-col pt-0">
            <span className={`text-[16px] font-semibold leading-none ${dayColor}`}>
              {day.dayName}
            </span>
            <span className="text-[12px] text-[#6F6F6F] leading-none">{day.dateStr}</span>
          </div>
        </div>

        <input type="hidden" {...register(`days.${index}.id` as const)} />

        <div className="flex flex-col">
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            autoComplete="off"
            {...register(`days.${index}.hours` as const)}
            onKeyDown={e => {
              if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
            }}
            onInput={e => {
              const input = e.currentTarget;
              const regex = /^\d{0,2}(\.\d{0,1})?$/;

              if (!regex.test(input.value)) {
                input.value = input.value.slice(0, -1);
              }

              cleanInputErrors(input.value);
            }}
            className={`w-[36px] h-[36px] border rounded-md text-center text-[14px] text-[#1F2937] placeholder:text-[#D1D5DB] outline-none shrink-0 bg-transparent transition-colors ${
              dayError?.hours
                ? 'border-red-500 focus:border-red-500'
                : 'border-[#E0E1E2] focus:border-[#9c9c9c]'
            }`}
          />
        </div>

        <div className="flex-1 flex flex-col relative">
          <input
            type="text"
            autoComplete="off"
            onInput={e => {
              const input = e.currentTarget;
              cleanInputErrors(input.value);
            }}
            placeholder={commentPlaceholder}
            {...register(`days.${index}.description` as const)}
            className={`h-[36px] border rounded-md px-4 py-2 text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none min-w-0 bg-transparent transition-colors ${
              dayError?.description
                ? 'border-red-500 focus:border-red-500'
                : 'border-[#E0E1E2] focus:border-[#9c9c9c]'
            }`}
          />
          {dayError?.description && (
            <span className="text-[10px] text-red-500 absolute mt-[38px]">
              {dayError.description.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
