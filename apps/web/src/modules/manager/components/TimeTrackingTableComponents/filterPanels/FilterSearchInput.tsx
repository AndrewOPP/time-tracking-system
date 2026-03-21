import { Search } from 'lucide-react';

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FilterSearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
}: FilterSearchInputProps) => {
  return (
    <div className="px-3 pt-[12px]">
      <div className="relative flex items-center">
        <Search className="absolute left-[12px] h-4 w-4 text-[#686868]" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-[36px] pr-3 py-[6px] h-[34px] text-[14px] border border-[#E0E1E2] rounded-[6px] outline-none focus:border-gray-400 placeholder:text-[#686868]"
        />
      </div>
    </div>
  );
};
