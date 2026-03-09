import { Clock, Pencil, Trash2 } from 'lucide-react';
import { DialogType, type DayGroup } from '../types/timeLogs';
import { useDialogStore } from '../store/useDialogStore';

interface DayCardProps {
  dayData: DayGroup;
  index?: number;
  onTrackClick?: (date: string) => void;
  onEditClick?: (logId: string) => void;
  onDeleteClick?: (logId: string) => void;
}

export const DayCard = ({ dayData, index = 0, onTrackClick }: DayCardProps) => {
  const { openDialog } = useDialogStore();

  const hasEntries = dayData.entries.length > 0;

  const isWeekend = dayData.dayName === 'Saturday' || dayData.dayName === 'Sunday';

  const borderClass = isWeekend ? 'border-dashed  border-gray-300' : 'border-solid border-gray-200';
  const titleColor = isWeekend ? 'text-gray-500' : 'text-gray-900';
  const emptyText = isWeekend
    ? 'Add working hours if needed. Thank you for your time and contribution!'
    : 'Please enter work hours for today!';

  return (
    <div
      className="w-full flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
    >
      <div
        className={`h-[72px] bg-[#F9FAFB] py-4 px-6 flex items-center justify-between border ${borderClass} rounded-t-[12px] `}
      >
        <div className="flex items-center gap-4">
          <span className="bg-[#6F6F6F1A] text-gray-800 font-semibold px-2 py-1 rounded-md text-sm min-w-[3rem] text-center">
            {dayData.totalHours.toFixed(1)}
          </span>
          <span className={`font-bold text-base ${titleColor}`}>
            {dayData.dayName} | {dayData.dateStr}
          </span>
        </div>

        <button
          onClick={() => onTrackClick?.(dayData.fullDate)}
          className="flex items-center gap-2 bg-[#509665] hover:bg-[#4E916B] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          Track hours
        </button>
      </div>

      <div className={`border-x border-b ${borderClass} rounded-b-[12px] bg-white flex flex-col`}>
        {!hasEntries ? (
          <div className="min-h-[74px] py-[28px] px-[24px] flex items-center gap-[16px]">
            <span className="text-gray-900 font-semibold text-sm min-w-[3rem] text-center">
              0.0
            </span>
            <span className="text-[#6F6F6F] text-sm">{emptyText}</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {dayData.entries.map((entry, entryIndex) => {
              const isLast = entryIndex === dayData.entries.length - 1;

              return (
                <div
                  key={entry.id}
                  className={`max-h-[74px] py-[28px] px-[24px] flex items-center gap-[16px] group ${
                    !isLast ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-900 font-semibold text-sm min-w-[3rem] text-center mt-0.5">
                    {Number(entry.hours).toFixed(1)}
                  </span>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {entry.project?.name || 'Unknown Project'}
                    </h4>
                    <p className="text-[#6F6F6F] text-sm mt-1 leading-snug">{entry.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openDialog(DialogType.TRACK_TIME, { log: entry })}
                      className="hover:text-gray-800 transition-colors p-1 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openDialog(DialogType.DELETE_TIME_LOG, { log: entry })}
                      className="hover:text-red-600 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
