import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigationProps {
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weekRangeText: string;
  totalHours: number;
}

export const WeekNavigation = ({
  onPrevWeek,
  onNextWeek,
  weekRangeText,
  totalHours,
}: WeekNavigationProps) => {
  return (
    <div className="mb-5 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onPrevWeek}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h3 className="text-[1.15rem] font-bold text-gray-900">{weekRangeText}</h3>

        <button
          onClick={onNextWeek}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="text-gray-500 font-medium text-[16px]">
        Total for week:
        <span className="font-bold text-gray-900 ml-3">{totalHours.toFixed(1)}</span>
      </div>
    </div>
  );
};
