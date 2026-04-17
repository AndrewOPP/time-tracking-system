import { Pencil, Trash2 } from 'lucide-react';
import { DialogType, type TimeLog } from '../types/timeLogs';
import { useDialogStore } from '../store/useDialogStore';

export const DayCardLogItem = ({ timeLog, isLast }: { timeLog: TimeLog; isLast: boolean }) => {
  const { openDialog } = useDialogStore();

  return (
    <div
      className={`max-h-[72px] py-[20px] px-[24px] flex items-center gap-[16px] group ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <span className="text-gray-900 font-semibold text-sm min-w-[3rem] text-center mt-0.5 shrink-0">
        {Number(timeLog.hours).toFixed(1)}
      </span>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm truncate">
          {timeLog.project?.name || 'Unknown Project'}
        </h4>

        <p className="text-[#6F6F6F] text-sm mt-1 leading-snug break-words whitespace-pre-wrap line-clamp-1">
          {timeLog.description}
        </p>
      </div>

      <div className="flex items-center gap-3 text-gray-400 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => openDialog(DialogType.TRACK_TIME, { log: timeLog })}
          className="hover:text-gray-800 transition-colors p-1 cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => openDialog(DialogType.DELETE_TIME_LOG, { log: timeLog })}
          className="hover:text-red-600 transition-colors p-1 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
