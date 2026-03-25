import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = 'Search...' }: SearchInputProps) => {
  return (
    <div className={`relative w-full max-w-[505px]`}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
        placeholder={placeholder}
        className="pl-4 pr-16 py-2 text-[16px] text-[#1F1F1F] placeholder:text-[#6F6F6F] border border-[#E0E1E2] h-10 w-full rounded-[6px] bg-white outline-none focus:border-gray-400 transition-colors"
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-[#6F6F6F] hover:text-[#1F1F1F] transition-colors outline-none cursor-pointer"
          type="button"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1F1F1F] pointer-events-none" />
    </div>
  );
};
