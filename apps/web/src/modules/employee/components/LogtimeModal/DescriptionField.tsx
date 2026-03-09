import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { LogTimeFormValues } from '../../hooks/useLogTimeForm';

interface Props {
  register: UseFormRegister<LogTimeFormValues>;
  errors: FieldErrors<LogTimeFormValues>;
}

export const DescriptionField = ({ register, errors }: Props) => {
  return (
    <div className="flex flex-col px-5">
      <label className="font-semibold text-[16px] text-gray-900 pb-3">
        Description <span className="text-[#4E916B]">*</span>
      </label>

      <textarea
        placeholder="What did you work on?"
        {...register('description')}
        className={`text-[#6F6F6F] w-full min-h-[140px] p-3 rounded-[8px] border ${
          errors.description ? 'border-red-500' : 'border-[#E0E1E2]'
        } resize-none`}
      />

      <span className="text-red-500 text-sm mt-1 min-h-[20px] block">
        {errors.description?.message}
      </span>
    </div>
  );
};
