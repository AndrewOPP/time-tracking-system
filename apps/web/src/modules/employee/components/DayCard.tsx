import { Clock, Pencil, Trash2 } from 'lucide-react';
import type { DayGroup } from '../types/timeLogs';
import { useDeleteLogMutation, useUpdateLogMutation } from '../hooks/useMutations';

interface DayCardProps {
  dayData: DayGroup;
  index?: number;
  onTrackClick?: (date: string) => void;
  onEditClick?: (logId: string) => void;
  onDeleteClick?: (logId: string) => void;
}

export const DayCard = ({ dayData, index = 0, onTrackClick }: DayCardProps) => {
  const updateLogMutation = useUpdateLogMutation();
  const deleteLogMutation = useDeleteLogMutation();

  const updateLogHandler = (logId: string) => {
    updateLogMutation.mutate({ id: logId, updateLog: { description: 'Updated' } });
  };
  const deleteLogHandler = (logId: string) => {
    deleteLogMutation.mutate({ id: logId });
  };

  const hasEntries = dayData.entries.length > 0;

  return (
    <div
      className="w-full flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
    >
      <div className="h-[72px] py-4 px-6 flex items-center justify-between border border-gray-200 rounded-t-[12px] bg-gray-50/50">
        <div className="flex items-center gap-4">
          <span className="bg-gray-200/80 text-gray-800 font-semibold px-2 py-1 rounded-md text-sm min-w-[3rem] text-center">
            {dayData.totalHours.toFixed(1)}
          </span>
          <span className="font-bold text-gray-900 text-base">
            {dayData.dayName} <span className="font-normal text-gray-500">| {dayData.dateStr}</span>
          </span>
        </div>

        <button
          onClick={() => onTrackClick?.(dayData.fullDate)}
          className="flex items-center gap-2 bg-[#509665] hover:bg-[#438255] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Clock className="w-4 h-4" />
          Track hours
        </button>
      </div>

      <div className="border-x border-b border-gray-200 rounded-b-[12px] bg-white flex flex-col">
        {!hasEntries ? (
          <div className="min-h-[74px] py-[28px] px-[24px] flex items-center gap-[16px]">
            <span className="text-gray-900 font-semibold text-sm min-w-[3rem] text-center">
              0.0
            </span>
            <span className="text-gray-400 text-sm">Please enter work hours for today!</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {dayData.entries.map((entry, entryIndex) => {
              const isLast = entryIndex === dayData.entries.length - 1;

              return (
                <div
                  key={entry.id}
                  className={`min-h-[74px] py-[28px] px-[24px] flex items-start gap-[16px] group ${
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
                    <p className="text-gray-500 text-sm mt-1 leading-snug">{entry.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateLogHandler(entry.id)}
                      className="hover:text-gray-800 transition-colors p-1 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLogHandler(entry.id)}
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
