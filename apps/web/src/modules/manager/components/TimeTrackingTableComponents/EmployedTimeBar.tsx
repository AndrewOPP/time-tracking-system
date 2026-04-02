import { Tooltip, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import type { CalculatedEmployedTimeData } from '../../types/managerAIChat.types';
import { BAR_CONFIG } from '../../constants/constants';
import { formatHours } from '../../utils/formatHours';
import { EmployeeTimeBarTooltipContent } from '../EmployeeTimeBarTooltipContent';

interface EmployedTimeBarProps {
  employedTimeData: CalculatedEmployedTimeData;
  totalUserHours: number;
}

export const EmployedTimeBar: React.FC<EmployedTimeBarProps> = ({
  employedTimeData,
  totalUserHours,
}) => {
  const { visualPercents, employedTimePercent, tooltip } = employedTimeData;

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
          tooltipData={tooltip}
          totalUserHours={totalUserHours}
          formatHours={formatHours}
        />
      </Tooltip>
    </TooltipProvider>
  );
};
