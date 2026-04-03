import type { FilterRanges } from '../hooks/useTableFilters';

export const findActiveRanges = (ranges: FilterRanges) => {
  return Object.values(ranges).filter(range => range.min !== null || range.max !== null);
};
