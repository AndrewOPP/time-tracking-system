import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigationProps {
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthText: string;
  totalHours?: number;
}

export const MonthNavigation = ({
  onPrevMonth,
  onNextMonth,
  monthText,
  totalHours,
}: MonthNavigationProps) => {
  const isProjectTrack = totalHours || totalHours === 0 ? false : true;

  const containerMb = isProjectTrack ? '' : 'mb-3 sm:mb-5';

  return (
    <div className={`${containerMb} flex flex-wrap justify-between items-center gap-y-2`}>
      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={onPrevMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        <div
          className={
            isProjectTrack
              ? 'flex items-center justify-center w-[140px] sm:w-[215px] h-[32px] sm:h-[36px] border border-gray-200 rounded-[6px] px-2 sm:px-6 py-2 bg-white'
              : 'text-[0.95rem] sm:text-[1.15rem] font-bold text-gray-900 w-[140px] sm:w-[215px] text-center shrink-0'
          }
        >
          <span
            className={`${isProjectTrack ? 'text-[12px] sm:text-[14px] font-medium' : ''} text-gray-900 truncate block`}
          >
            {monthText}
          </span>
        </div>

        <button
          type="button"
          onClick={onNextMonth}
          className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>

      {(totalHours || totalHours === 0) && !isProjectTrack && (
        <div className="text-gray-500 font-medium text-[13px] sm:text-[16px] whitespace-nowrap">
          <span className="hidden xs:inline">Total for month:</span>
          <span className="xs:hidden">Total:</span>
          <span className="font-bold text-gray-900 ml-1.5 sm:ml-3">{totalHours.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};
