import { cn } from '@lib/utils';
import { Clock } from 'lucide-react';

interface DayCardHeaderProps {
  totalHours: number;
  dayName: string;
  dateStr: string;
  titleColor: string;
  borderClass: string;
  onTrackClick: () => void;
}

export const DayCardHeader = ({
  totalHours,
  dayName,
  dateStr,
  titleColor,
  borderClass,
  onTrackClick,
}: DayCardHeaderProps) => {
  return (
    <div
      className={cn(
        'h-18 bg-[#F9FAFB] py-4 px-6 flex items-center justify-between border rounded-t-[12px]',
        borderClass
      )}
    >
      <div className="flex items-center gap-4">
        <span className="bg-[#6F6F6F1A] text-gray-800 font-semibold px-2 py-1 rounded-md text-sm min-w-[3rem] text-center">
          {totalHours.toFixed(1)}
        </span>
        <span className={`font-bold text-base ${titleColor}`}>
          {dayName} | {dateStr}
        </span>
      </div>

      <button
        onClick={onTrackClick}
        className="flex items-center gap-2 bg-[#509665] hover:bg-[#4E916B] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        <Clock className="w-4 h-4" />
        Track hours
      </button>
    </div>
  );
};
