import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import { FILTER_PARAM_KEYS } from '../constants/constants';

export const useTableFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilterSet = useCallback(
    (paramName: string) => {
      const paramValue = searchParams.get(paramName);
      return new Set(paramValue ? paramValue.split(',') : []);
    },
    [searchParams]
  );

  const selectedEmployees = useMemo(
    () => getFilterSet(FILTER_PARAM_KEYS.EMPLOYEES),
    [getFilterSet]
  );
  const selectedProjects = useMemo(() => getFilterSet(FILTER_PARAM_KEYS.PROJECTS), [getFilterSet]);
  const selectedPms = useMemo(() => getFilterSet(FILTER_PARAM_KEYS.PMS), [getFilterSet]);

  const toggleFilter = useCallback(
    (paramName: string, id: string, currentSet: Set<string>) => {
      const newSet = new Set(currentSet);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      const params = new URLSearchParams(searchParams);
      if (newSet.size > 0) {
        params.set(paramName, Array.from(newSet).join(','));
      } else {
        params.delete(paramName);
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const clearCategory = (paramName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(paramName);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    Object.values(FILTER_PARAM_KEYS).forEach(key => params.delete(key));
    setSearchParams(params);
  };

  const toggleEmployee = (id: string) =>
    toggleFilter(FILTER_PARAM_KEYS.EMPLOYEES, id, selectedEmployees);
  const toggleProject = (id: string) =>
    toggleFilter(FILTER_PARAM_KEYS.PROJECTS, id, selectedProjects);
  const togglePm = (id: string) => toggleFilter(FILTER_PARAM_KEYS.PMS, id, selectedPms);

  return {
    selectedEmployees,
    selectedProjects,
    selectedPms,

    toggleEmployee,
    toggleProject,
    togglePm,
    clearAllFilters,
    clearCategory,
  };
};
