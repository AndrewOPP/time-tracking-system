import { PROJECT_TYPE } from '../constants/constants';
import type { ProjectData, WeekInfo } from '../types/managerAIChat.types';
import { calculatePercentage } from '../utils/mathUtils';

interface CalculatorInput {
  totalUserHours: number;
  weeksInfo: WeekInfo[];
  projects: ProjectData[];
}

export const calculateEmployedTimeData = ({
  totalUserHours,
  weeksInfo,
  projects,
}: CalculatorInput) => {
  const monthWorkingHours = weeksInfo.reduce((sum, week) => sum + week.workingHours, 0);

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
  const employedTimePercent = calculatePercentage(
    billableHours + nonBillableHours + overtimeHours,
    monthWorkingHours
  );

  return {
    hours: {
      billable: billableHours,
      nonBillable: nonBillableHours,
      untracked: untrackedHours,
      overtime: overtimeHours,
    },
    visualPercents: {
      billable: visualBillablePercent,
      nonBillable: visualNonBillablePercent,
      untracked: visualUntrackedPercent,
      overtime: visualOvertimePercent,
    },
    employedTimePercent,
    monthWorkingHours,
  };
};
