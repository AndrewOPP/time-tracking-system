import type { ManagerDashboardRow } from '../types/managerAIChat.types';
import type { findActiveRanges } from './findActiveRanges';

const isInRange = (value: number, min: number | null, max: number | null) => {
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
};

export const checkRangePasses = (
  range: ReturnType<typeof findActiveRanges>[0],
  row: ManagerDashboardRow,
  filteredProjects: NonNullable<ManagerDashboardRow['projects']>
): boolean => {
  let valueToCheck = 0;

  switch (range.id) {
    case 'total':
      valueToCheck = row.totalUserHours;
      break;
    case 'pto':
      valueToCheck = row.ptoHours;
      break;
    case 'employedPercent':
      valueToCheck = row.eployedPercent.employedTimePercent;
      break;
    case 'week1':
    case 'week2':
    case 'week3':
    case 'week4':
    case 'week5':
    case 'week6':
      valueToCheck = filteredProjects.reduce((sum, p) => {
        const weekHours = p.weeks[range.id as keyof typeof p.weeks] || 0;
        return sum + weekHours;
      }, 0);
      break;
    default:
      return true;
  }

  return isInRange(valueToCheck, range.min, range.max);
};
