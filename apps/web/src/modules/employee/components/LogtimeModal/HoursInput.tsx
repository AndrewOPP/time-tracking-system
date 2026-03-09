import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { LogTimeFormValues } from '../../hooks/useLogTimeForm';

interface Props {
  register: UseFormRegister<LogTimeFormValues>;
  errors: FieldErrors<LogTimeFormValues>;
}

export const HoursInput = ({ register, errors }: Props) => {
  return (
    <div className="flex flex-col px-5">
      <label className="font-semibold text-[16px] text-gray-900 pb-3">
        Amount of working hours <span className="text-[#4E916B]">*</span>
      </label>

      <div className="flex items-center">
        <input
          type="number"
          step="0.1"
          {...register('hours', { valueAsNumber: true })}
          onKeyDown={e => {
            if (['-', '+', 'e', 'E'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onInput={e => {
            const input = e.currentTarget;
            const regex = /^\d{0,2}(\.\d{0,1})?$/;

            if (!regex.test(input.value)) {
              input.value = input.value.slice(0, -1);
            }
          }}
          className={`w-[37px] h-[36px] rounded-[8px] text-center border ${errors.hours ? 'border-red-500' : 'border-[#E0E1E2]'} focus:outline-none focus:ring-1 focus:ring-[#d1d1d1] transition-all`}
        />

        <span className="text-[#6F6F6F] font-medium text-[16px] ml-3">hours</span>
      </div>

      <span className="text-red-500 text-sm mt-1 min-h-[20px] block">{errors.hours?.message}</span>
    </div>
  );
};
