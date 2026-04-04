import { AI_WORK_FORMAT } from '../../aichat/constants/aichat.constants';
import { PROJECT_TYPE } from '../constants/timeLogs.constants';
import { CalculatedEmployedTimeData, CalculatorInput } from '../types/timeLogs.types';
import { calculatePercentage } from './math.utils';

const roundHours = (hours: number): number => Number(hours.toFixed(1));

export const calculateEmployedTimeData = ({
  totalUserHours,
  weeksInfo,
  projects,
  workFormat = AI_WORK_FORMAT.FULL_TIME,
}: CalculatorInput): CalculatedEmployedTimeData => {
  const baseMonthWorkingHours = weeksInfo.reduce((sum, week) => sum + week.workingHours, 0);

  const monthWorkingHours =
    workFormat === AI_WORK_FORMAT.PART_TIME ? baseMonthWorkingHours * 0.5 : baseMonthWorkingHours;

  const billableHours = projects
    .filter(project => project.type === PROJECT_TYPE.billable)
    .reduce((sum, project) => sum + project.perProjectTotal, 0);

  const nonBillableHours = projects
    .filter(project => project.type === PROJECT_TYPE.nonBillable)
    .reduce((sum, project) => sum + project.perProjectTotal, 0);

  const isOvertime = totalUserHours > monthWorkingHours;
  const overtimeHours = isOvertime ? totalUserHours - monthWorkingHours : 0;
  const untrackedHours = isOvertime ? 0 : monthWorkingHours - totalUserHours;

  const visualTotal = Math.max(monthWorkingHours, totalUserHours) || 1;
  const baseScale = isOvertime ? monthWorkingHours / totalUserHours : 1;

  const visualBillablePercent = calculatePercentage(billableHours * baseScale, visualTotal, 2);
  const visualNonBillablePercent = calculatePercentage(
    nonBillableHours * baseScale,
    visualTotal,
    2
  );
  const visualUntrackedPercent = calculatePercentage(untrackedHours, visualTotal, 2);
  const visualOvertimePercent = calculatePercentage(overtimeHours, visualTotal, 2);

  const baseBillableHours = billableHours * baseScale;
  const baseNonBillableHours = nonBillableHours * baseScale;

  const tooltipBillablePercent = calculatePercentage(baseBillableHours, monthWorkingHours);
  const tooltipNonBillablePercent = calculatePercentage(baseNonBillableHours, monthWorkingHours);
  const tooltipOvertimePercent = calculatePercentage(overtimeHours, monthWorkingHours);
  const tooltipUntrackedPercent = calculatePercentage(untrackedHours, monthWorkingHours, 2);

  const aiChatBillableHoursPercent = calculatePercentage(baseBillableHours, monthWorkingHours);
  const aiChatNonBillableHoursPercent = calculatePercentage(
    baseNonBillableHours,
    monthWorkingHours,
    2
  );
  const aiChatUntrackedHoursPercent = calculatePercentage(untrackedHours, monthWorkingHours, 2);
  const aiChatOvertimeHoursPercent = calculatePercentage(overtimeHours, monthWorkingHours, 2);

  const employedTimePercent = calculatePercentage(
    billableHours + nonBillableHours,
    monthWorkingHours
  );

  return {
    hours: {
      billable: roundHours(billableHours),
      nonBillable: roundHours(nonBillableHours),
      untracked: roundHours(untrackedHours),
      overtime: roundHours(overtimeHours),
    },
    visualPercents: {
      billable: visualBillablePercent,
      nonBillable: visualNonBillablePercent,
      untracked: visualUntrackedPercent,
      overtime: visualOvertimePercent,
    },
    aiChatVisualPercents: {
      billable: aiChatBillableHoursPercent,
      nonBillable: aiChatNonBillableHoursPercent,
      untracked: aiChatUntrackedHoursPercent,
      overtime: aiChatOvertimeHoursPercent,
    },
    tooltip: {
      hours: {
        billable: roundHours(baseBillableHours),
        nonBillable: roundHours(baseNonBillableHours),
        overtime: roundHours(overtimeHours),
        untracked: roundHours(untrackedHours),
      },
      percents: {
        billable: tooltipBillablePercent,
        nonBillable: tooltipNonBillablePercent,
        overtime: tooltipOvertimePercent,
        total: employedTimePercent,
        untracked: tooltipUntrackedPercent,
      },
    },
    employedTimePercent: roundHours(employedTimePercent),
    monthWorkingHours: roundHours(monthWorkingHours),
    totalUserHours: roundHours(totalUserHours),
  };
};
