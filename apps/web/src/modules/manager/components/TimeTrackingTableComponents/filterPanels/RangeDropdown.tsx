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

const VALID_RANGE_OPTIONS = Array.from({ length: 9 })
  .map((_, index) => index * 25)
  .filter(val => val !== 0);

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
      value={selectedValue !== null ? String(selectedValue) : 'all'}
      onValueChange={val => onChange(val === 'all' ? null : Number(val))}
    >
      <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-none hover:border-gray-400 transition-colors cursor-pointer outline-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={4}
        className="shadow-none border-[#E0E1E2] w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
      >
        <SelectGroup>
          <SelectItem className="cursor-pointer" value="all">
            Any
          </SelectItem>

          {VALID_RANGE_OPTIONS.map(itemValue => (
            <SelectItem
              className="cursor-pointer"
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
