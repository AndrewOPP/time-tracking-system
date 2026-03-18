import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import type { ProjectData, WeekInfo } from '../../types/managerAIChat.types';
import { BAR_CONFIG } from '../../constants/constants';
import { calculateEmployedTimeData } from '../../utils/employedTimeCalculator';
import { formatHours } from '../../utils/formatHours';
import { TooltipRow } from './TooltipRow';

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
    totalUserHours > 0 ? Math.round((hoursValue / monthWorkingHours) * 100) : 0;

  const barSegments = [
    { key: 'billable', value: visualPercents.billable, color: BAR_CONFIG.colors.billable },
    { key: 'nonBillable', value: visualPercents.nonBillable, color: BAR_CONFIG.colors.nonBillable },
    { key: 'untracked', value: visualPercents.untracked, color: BAR_CONFIG.colors.untracked.bg },
    { key: 'overtime', value: visualPercents.overtime, color: BAR_CONFIG.colors.overtime },
  ];

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

        <TooltipContent
          side="top"
          className="w-auto py-3 px-4 shadow-lg bg-[#FFFFFF] border border-[#EEEEEE] rounded-xl"
        >
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-5 gap-y-2.5 text-sm items-center">
            {hours.billable > 0 && (
              <TooltipRow
                title={BAR_CONFIG.titles.billable}
                hoursValue={hours.billable}
                percent={getPercent(hours.billable)}
                color={BAR_CONFIG.colors.billable}
              />
            )}

            {hours.nonBillable > 0 && (
              <TooltipRow
                title={BAR_CONFIG.titles.nonBillable}
                hoursValue={hours.nonBillable}
                percent={getPercent(hours.nonBillable)}
                color={BAR_CONFIG.colors.nonBillable}
              />
            )}

            {hours.overtime > 0 && (
              <TooltipRow
                title={BAR_CONFIG.titles.overtime}
                hoursValue={hours.overtime}
                percent={getPercent(hours.overtime)}
                color={BAR_CONFIG.colors.overtime}
              />
            )}

            {hours.untracked > 0 && (
              <TooltipRow
                title={BAR_CONFIG.titles.untracked}
                hoursValue={hours.untracked}
                percent={getPercent(hours.untracked)}
                color={BAR_CONFIG.colors.untracked.text}
                dotColor={BAR_CONFIG.colors.untracked.bg}
              />
            )}

            <div className="col-span-3 border-t border-dashed border-[#D1D5DB] my-0.5" />

            <div className="font-semibold text-[#1F1F1F]">Total</div>
            <div className="font-semibold text-right text-[#1F1F1F]">{employedTimePercent}%</div>
            <div className="font-semibold text-right text-[#1F1F1F]">
              [{formatHours(totalUserHours)}]
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
