import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import React from 'react';
import type { ProjectData, WeekInfo } from '../../types/managerAIChat.types';
import { BAR_CONFIG } from '../../constants/constants';
import { calculateEmployedTimeData } from '../../utils.ts/employedTimeCalculator';

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

  const formatHours = (hours: number) => `${hours.toFixed(1).replace(/\.0$/, '')}h`;
  const getPercent = (hours: number) =>
    totalUserHours > 0 ? Math.round((hours / monthWorkingHours) * 100) : 0;

  const renderRow = (hoursValue: number, title: string, hexColor: string, dotColor?: string) => {
    const pureColor = hexColor.replace(/\[|\]/g, '');
    const pureDotColor = dotColor?.replace(/\[|\]/g, '');
    return (
      <>
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: pureDotColor ? pureDotColor : pureColor }}
          />
          <span className="text-[#1F1F1F]">{title}</span>
        </div>

        <div className="text-right" style={{ color: pureColor }}>
          {getPercent(hoursValue)}%
        </div>

        <div className="text-right" style={{ color: pureColor }}>
          [{formatHours(hoursValue)}]
        </div>
      </>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 w-full max-w-[256px] cursor-help">
            <span className="text-sm font-medium w-9">{employedTimePercent}%</span>

            <div
              className={`flex w-full h-2 ${BAR_CONFIG.dimensions.radius} ${BAR_CONFIG.dimensions.gap}`}
            >
              {visualPercents.billable > 0 && (
                <div
                  className={`h-full transition-all duration-300 ${BAR_CONFIG.dimensions.radius}`}
                  style={{
                    width: `${visualPercents.billable}%`,
                    backgroundColor: BAR_CONFIG.colors.billable,
                  }}
                />
              )}
              {visualPercents.nonBillable > 0 && (
                <div
                  className={`h-full transition-all duration-300 ${BAR_CONFIG.dimensions.radius}`}
                  style={{
                    width: `${visualPercents.nonBillable}%`,
                    backgroundColor: BAR_CONFIG.colors.nonBillable,
                  }}
                />
              )}
              {visualPercents.untracked > 0 && (
                <div
                  className={`h-full transition-all duration-300 ${BAR_CONFIG.dimensions.radius}`}
                  style={{
                    width: `${visualPercents.untracked}%`,
                    backgroundColor: BAR_CONFIG.colors.untracked.bg,
                  }}
                />
              )}
              {visualPercents.overtime > 0 && (
                <div
                  className={`h-full transition-all duration-300 ${BAR_CONFIG.dimensions.radius}`}
                  style={{
                    width: `${visualPercents.overtime}%`,
                    backgroundColor: BAR_CONFIG.colors.overtime,
                  }}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="w-auto py-3 px-4 shadow-lg bg-[#FFFFFF] border border-[#EEEEEE] rounded-xl"
        >
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-5 gap-y-2.5 text-sm items-center">
            {hours.billable > 0 &&
              renderRow(hours.billable, BAR_CONFIG.titles.billable, BAR_CONFIG.colors.billable)}

            {hours.nonBillable > 0 &&
              renderRow(
                hours.nonBillable,
                BAR_CONFIG.titles.nonBillable,
                BAR_CONFIG.colors.nonBillable
              )}

            {hours.overtime > 0 &&
              renderRow(hours.overtime, BAR_CONFIG.titles.overtime, BAR_CONFIG.colors.overtime)}

            {hours.untracked > 0 &&
              renderRow(
                hours.untracked,
                BAR_CONFIG.titles.untracked,
                BAR_CONFIG.colors.untracked.text,
                BAR_CONFIG.colors.untracked.bg
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
