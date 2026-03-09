import type { DayGroup } from '../types/timeLogs';
import { DayCardEmptyState } from './DayCardEmptyState';
import { DayCardHeader } from './DayCardHeader';
import { DayCardLogItem } from './DayCardLogItem';

interface DayCardProps {
  dayData: DayGroup;
  index?: number;
  onTrackClick: (date: string) => void;
}

export const DayCard = ({ dayData, index = 0, onTrackClick }: DayCardProps) => {
  const hasEntries = dayData.entries.length > 0;
  const isWeekend = dayData.dayName === 'Saturday' || dayData.dayName === 'Sunday';

  const borderClass = isWeekend ? 'border-dashed border-gray-300' : 'border-solid border-gray-200';
  const titleColor = isWeekend ? 'text-gray-500' : 'text-gray-900';
  const emptyText = isWeekend
    ? 'Add working hours if needed. Thank you for your time and contribution!'
    : 'Please enter work hours for today!';

  return (
    <div
      className="w-full  flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      }}
    >
      <DayCardHeader
        totalHours={dayData.totalHours}
        dayName={dayData.dayName}
        dateStr={dayData.dateStr}
        titleColor={titleColor}
        borderClass={borderClass}
        onTrackClick={() => onTrackClick?.(dayData.fullDate)}
      />

      <div className={`border-x border-b ${borderClass} rounded-b-[12px] bg-white flex flex-col`}>
        {!hasEntries ? (
          <DayCardEmptyState emptyText={emptyText} />
        ) : (
          <div className="flex flex-col">
            {dayData.entries.map((entry, entryIndex) => (
              <DayCardLogItem
                key={entry.id}
                timeLog={entry}
                isLast={entryIndex === dayData.entries.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
