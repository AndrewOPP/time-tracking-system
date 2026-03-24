import {
  CATEGORIES,
  CATEGORY_TYPE,
  FILTER_PARAM_KEYS,
  RANGE_MIN_MAX,
} from '../constants/constants';
import type { EmploymentFormatValue, RangeType } from '../constants/constants';
import { useUrlParams } from './useUrlParams';

export interface RangeState {
  min: number | null;
  max: number | null;
  id: string;
  label: string;
}

export type RangeKey = Extract<
  (typeof CATEGORIES)[number],
  { type: typeof CATEGORY_TYPE.range }
>['id'];

export type FilterRanges = Record<RangeKey, RangeState>;

const isRangeKey = (key: string): key is RangeKey => {
  return CATEGORIES.some(item => item.id === key && item.type === CATEGORY_TYPE.range);
};

const getRangeParamKey = (key: RangeKey, type: RangeType) => `${key}_${type}`;

export const useTableFilters = () => {
  const { getSet, getNumber, getString, setValue, toggleInSet, deleteKey, clearAll, deleteKeys } =
    useUrlParams();

  const selectedEmployees = getSet(FILTER_PARAM_KEYS.EMPLOYEES);
  const selectedProjects = getSet(FILTER_PARAM_KEYS.PROJECTS);
  const selectedPms = getSet(FILTER_PARAM_KEYS.PMS);
  const selectedFormat = getString(FILTER_PARAM_KEYS.FORMAT) as EmploymentFormatValue | null;

  const getRange = (key: RangeKey, label: string): RangeState => ({
    min: getNumber(getRangeParamKey(key, RANGE_MIN_MAX.min)),
    max: getNumber(getRangeParamKey(key, RANGE_MIN_MAX.max)),
    id: key,
    label: label,
  });

  const ranges = Object.fromEntries(
    CATEGORIES.filter(category => category.type === CATEGORY_TYPE.range).map(({ id, label }) => [
      id,
      getRange(id, label),
    ])
  ) as FilterRanges;

  const toggleEmployee = (id: string) => toggleInSet(FILTER_PARAM_KEYS.EMPLOYEES, id);
  const toggleProject = (id: string) => toggleInSet(FILTER_PARAM_KEYS.PROJECTS, id);
  const togglePm = (id: string) => toggleInSet(FILTER_PARAM_KEYS.PMS, id);
  const setFormat = (val: EmploymentFormatValue | null) => setValue(FILTER_PARAM_KEYS.FORMAT, val);

  const setRangeValue = (key: RangeKey, type: RangeType, value: number | null) => {
    setValue(getRangeParamKey(key, type), value);
  };

  const clearCategory = (key: string) => {
    if (isRangeKey(key)) {
      deleteKeys([
        getRangeParamKey(key, RANGE_MIN_MAX.min),
        getRangeParamKey(key, RANGE_MIN_MAX.max),
      ]);
    } else {
      deleteKey(key);
    }
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
    clearAllFilters: clearAll,
  };
};
