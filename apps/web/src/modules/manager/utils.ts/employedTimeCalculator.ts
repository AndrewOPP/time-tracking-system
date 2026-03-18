import { PROJECT_TYPE } from '../constants/constants';
import type { ProjectData, WeekInfo } from '../types/managerAIChat.types';

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
  const monthWorkingHours = weeksInfo.reduce((sum, week) => {
    return (sum += week.workingHours);
  }, 0);

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

  const visualBillablePercent = ((billableHours * baseScale) / visualTotal) * 100;
  const visualNonBillablePercent = ((nonBillableHours * baseScale) / visualTotal) * 100;
  const visualUntrackedPercent = (untrackedHours / visualTotal) * 100;
  const visualOvertimePercent = (overtimeHours / visualTotal) * 100;

  const employedTimePercent = Math.round(
    ((billableHours + nonBillableHours + overtimeHours) / monthWorkingHours) * 100
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
