import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigationProps {
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weekRangeText: string;
  totalHours?: number;
}

export const WeekNavigation = ({
  onPrevWeek,
  onNextWeek,
  weekRangeText,
  totalHours,
}: WeekNavigationProps) => {
  const isProjectTrack = totalHours || totalHours === 0 ? false : true;

  const containerMb = isProjectTrack ? '' : 'mb-5';

  return (
    <div className={`${containerMb} flex justify-between items-center`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrevWeek}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div
          className={
            isProjectTrack
              ? 'flex items-center justify-center w-[215px] h-[36px] border border-gray-200 rounded-[6px] px-6 py-2 bg-white'
              : 'text-[1.15rem] font-bold text-gray-900 w-[215px] text-center shrink-0'
          }
        >
          <span className={isProjectTrack ? 'text-[14px] font-medium text-gray-900 truncate' : ''}>
            {weekRangeText}
          </span>
        </div>

        <button
          type="button"
          onClick={onNextWeek}
          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {(totalHours || totalHours === 0) && !isProjectTrack && (
        <div className="text-gray-500 font-medium text-[16px]">
          Total for week:
          <span className="font-bold text-gray-900 ml-3">{totalHours.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};
