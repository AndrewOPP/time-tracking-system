import { VALID_RANGE_OPTIONS } from '@/modules/manager/utils/validRangeOptions';
import { FILTER_ALL_VALUE } from '@/modules/manager/constants/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui';

interface RangeDropdownProps {
  label: string;
  placeholder: string;
  selectedValue: number | null;
  onChange: (value: number | null) => void;
  isOptionDisabled: (optionValue: number) => boolean;
}

export const RangeDropdown = ({
  label,
  placeholder,
  selectedValue,
  onChange,
  isOptionDisabled,
}: RangeDropdownProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-medium text-[#6F6F6F] ml-1">{label}</label>
    <Select
      value={selectedValue !== null ? String(selectedValue) : FILTER_ALL_VALUE}
      onValueChange={val => onChange(val === FILTER_ALL_VALUE ? null : Number(val))}
    >
      <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={4}
        className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] h-70"
      >
        <SelectGroup>
          <SelectItem className="cursor-pointer" value={FILTER_ALL_VALUE}>
            Any
          </SelectItem>

          {VALID_RANGE_OPTIONS.map(itemValue => (
            <SelectItem
              className="cursor-pointer "
              key={`${label}-${itemValue}`}
              value={String(itemValue)}
              disabled={isOptionDisabled(itemValue)}
            >
              {String(itemValue)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
