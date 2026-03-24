import { CATEGORIES, CATEGORY_TYPE, FILTER_PARAM_KEYS } from '../constants/constants';
import type { EmploymentFormatValue, RangeType } from '../constants/constants';
import { useUrlParams } from './useUrlParams';

export interface RangeState {
  min: number | null;
  max: number | null;
  id: string;
  label: string;
}

export type RangeKey = (typeof CATEGORIES)[number]['id'];

export type FilterRanges = Record<RangeKey, RangeState>;

const isRangeKey = (key: string): key is RangeKey => {
  return CATEGORIES.some(item => item.id === key && item.type === CATEGORY_TYPE.range);
};

export const useTableFilters = () => {
  const { getSet, getNumber, getString, setValue, toggleInSet, deleteKey, clearAll, deleteKeys } =
    useUrlParams();

  const selectedEmployees = getSet(FILTER_PARAM_KEYS.EMPLOYEES);
  const selectedProjects = getSet(FILTER_PARAM_KEYS.PROJECTS);
  const selectedPms = getSet(FILTER_PARAM_KEYS.PMS);
  const selectedFormat = getString(FILTER_PARAM_KEYS.FORMAT) as EmploymentFormatValue | null;

  const getRange = (key: RangeKey, label: string): RangeState => ({
    min: getNumber(`${key}_min`),
    max: getNumber(`${key}_max`),
    id: key,
    label: label,
  });

  const ranges = Object.fromEntries(
    CATEGORIES.map(({ id, label }) => [id, getRange(id, label)])
  ) as FilterRanges;

  const toggleEmployee = (id: string) => toggleInSet(FILTER_PARAM_KEYS.EMPLOYEES, id);

  const toggleProject = (id: string) => toggleInSet(FILTER_PARAM_KEYS.PROJECTS, id);

  const togglePm = (id: string) => toggleInSet(FILTER_PARAM_KEYS.PMS, id);

  const setFormat = (val: EmploymentFormatValue | null) => setValue(FILTER_PARAM_KEYS.FORMAT, val);

  const setRangeValue = (key: RangeKey, type: RangeType, value: number | null) => {
    setValue(`${key}_${type}`, value);
  };

  const clearCategory = (key: string) => {
    if (isRangeKey(key)) {
      deleteKeys([`${key}_min`, `${key}_max`]);
    } else {
      deleteKey(key);
    }
  };

  const clearAllFilters = () => {
    clearAll();
  };

  return {
    selectedEmployees,
    selectedProjects,
    selectedPms,
    selectedFormat,
    ranges,
    toggleEmployee,
    toggleProject,
    togglePm,
    setFormat,
    setRangeValue,
    clearCategory,
    clearAllFilters,
  };
};
