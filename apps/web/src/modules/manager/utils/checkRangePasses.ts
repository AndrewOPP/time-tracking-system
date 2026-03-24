import { RANGE_FILTER_KEYS } from '../constants/constants';
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

  if (range.id.startsWith('week')) {
    valueToCheck = filteredProjects.reduce((sum, p) => {
      const weekHours = p.weeks[range.id as keyof typeof p.weeks] || 0;
      return sum + weekHours;
    }, 0);
  } else {
    switch (range.id) {
      case RANGE_FILTER_KEYS.TOTAL:
        valueToCheck = row.totalUserHours;
        break;
      case RANGE_FILTER_KEYS.PTO:
        valueToCheck = row.ptoHours;
        break;
      case RANGE_FILTER_KEYS.EMPLOYED_PERCENT:
        valueToCheck = row.eployedPercent.employedTimePercent;
        break;
      default:
        return true;
    }
  }

  return isInRange(valueToCheck, range.min, range.max);
};
