import { TooltipContent } from '@components/ui/tooltip';
import { TooltipRow } from './TimeTrackingTableComponents/TooltipRow';
import { BAR_CONFIG } from '../constants/constants';

interface EmployeeTimeBarTooltipContentProps {
  hours: {
    billable: number;
    nonBillable: number;
    overtime: number;
    untracked: number;
  };
  totalUserHours: number;
  employedTimePercent: number | string;
  getPercent: (value: number) => number;
  formatHours: (value: number) => string;
}

export const EmployeeTimeBarTooltipContent = ({
  hours,
  totalUserHours,
  employedTimePercent,
  getPercent,
  formatHours,
}: EmployeeTimeBarTooltipContentProps) => {
  return (
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
  );
};
