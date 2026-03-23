import { Tooltip, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import type { ProjectData, WeekInfo } from '../../types/managerAIChat.types';
import { BAR_CONFIG } from '../../constants/constants';
import { calculateEmployedTimeData } from '../../utils/employedTimeCalculator';
import { formatHours } from '../../utils/formatHours';
import { calculatePercentage } from '../../utils/mathUtils';
import { EmployeeTimeBarTooltipContent } from '../EmployeeTimeBarTooltipContent';

interface EmployedTimeBarProps {
  totalUserHours: number;
  weeksInfo: WeekInfo[];
  projects: ProjectData[];
}

export const EmployedTimeBar: React.FC<EmployedTimeBarProps> = ({
  totalUserHours,
  weeksInfo,
  projects,
}) => {
  const { hours, visualPercents, employedTimePercent, monthWorkingHours } =
    calculateEmployedTimeData({ totalUserHours, weeksInfo, projects });

  const getPercent = (hoursValue: number) =>
    totalUserHours > 0 ? calculatePercentage(hoursValue, monthWorkingHours) : 0;

  const barSegments = [
    { key: 'billable', value: visualPercents.billable, color: BAR_CONFIG.colors.billable },
    { key: 'nonBillable', value: visualPercents.nonBillable, color: BAR_CONFIG.colors.nonBillable },
    { key: 'untracked', value: visualPercents.untracked, color: BAR_CONFIG.colors.untracked.bg },
    { key: 'overtime', value: visualPercents.overtime, color: BAR_CONFIG.colors.overtime },
  ] as const;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 w-full max-w-[256px] cursor-help">
            <span className="text-sm font-medium w-9">{employedTimePercent}%</span>

            <div
              className={`flex w-full h-2 ${BAR_CONFIG.dimensions.radius} ${BAR_CONFIG.dimensions.gap}`}
            >
              {barSegments.map(
                segment =>
                  segment.value > 0 && (
                    <div
                      key={segment.key}
                      className={`h-full transition-all duration-300 ${BAR_CONFIG.dimensions.radius}`}
                      style={{
                        width: `${segment.value}%`,
                        backgroundColor: segment.color.replace(/\[|\]/g, ''),
                      }}
                    />
                  )
              )}
            </div>
          </div>
        </TooltipTrigger>

        <EmployeeTimeBarTooltipContent
          hours={hours}
          totalUserHours={totalUserHours}
          employedTimePercent={employedTimePercent}
          getPercent={getPercent}
          formatHours={formatHours}
        />
      </Tooltip>
    </TooltipProvider>
  );
};
