import { SearchEmployeesArgs } from '../types/aichat.types';
import { AI_CHAT_LOAD_STATUSES, AI_CHAT_THRESHOLDS } from '../constants/aichat.constants';

export const getCurrentMonthDateRange = () => {
  const date = new Date();
  return {
    gte: new Date(date.getFullYear(), date.getMonth(), 1),
    lte: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};
// eslint-disable-next-line
export const applyLoadStatusFilter = (users: any[], args: SearchEmployeesArgs) => {
  if (args.realName) return users;

  let filtered = [...users];
  if (args.loadStatus === AI_CHAT_LOAD_STATUSES.AVAILABLE) {
    filtered = filtered.filter(
      u => u.stats.employedTimePercent < AI_CHAT_THRESHOLDS.MAX_CAPACITY_PERCENT
    );
    filtered.sort((a, b) => a.stats.employedTimePercent - b.stats.employedTimePercent);
  } else if (args.loadStatus === AI_CHAT_LOAD_STATUSES.OVERLOADED) {
    filtered = filtered.filter(
      u => u.stats.employedTimePercent > AI_CHAT_THRESHOLDS.MAX_CAPACITY_PERCENT
    );
    filtered.sort((a, b) => b.stats.employedTimePercent - a.stats.employedTimePercent);
  }
  return filtered;
};
