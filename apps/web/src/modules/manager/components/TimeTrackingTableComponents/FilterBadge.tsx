import { X } from 'lucide-react';
import type { ElementType } from 'react';

interface FilterBadgeProps {
  icon: ElementType;
  label: string;
  count?: number;
  paramName: string;

  onClear: (category: string) => void;
}

export const FilterBadge = ({ icon: Icon, label, count, paramName, onClear }: FilterBadgeProps) => {
  return (
    <div className="flex items-center text-center justify-center gap-2 px-[14px] py-[7.5px] bg-[#F7F7F7] border border-[#E0E1E2] rounded-[8px] text-[14px] text-[#1F1F1F] h-[36px]">
      <Icon className="h-4 w-4 text-[#6F6F6F]" />
      {count ? (
        <span>
          {label} {count > 0 && `+${count}`}
        </span>
      ) : (
        <span> {label}</span>
      )}

      <button
        onClick={() => onClear(paramName)}
        className="ml-1 pt-[2px]  text-[#1F1F1F] cursor-pointer"
      >
        <X className="h-4 w-4 " />
      </button>
    </div>
  );
};
