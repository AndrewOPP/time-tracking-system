import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

export const useTableFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilterSet = useCallback(
    (paramName: string) => {
      const paramValue = searchParams.get(paramName);
      return new Set(paramValue ? paramValue.split(',') : []);
    },
    [searchParams]
  );

  const selectedEmployees = useMemo(() => getFilterSet('employees'), [getFilterSet]);
  const selectedProjects = useMemo(() => getFilterSet('projects'), [getFilterSet]);
  const selectedPms = useMemo(() => getFilterSet('pms'), [getFilterSet]);

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
    params.delete('employees');
    params.delete('projects');
    params.delete('pms');
    setSearchParams(params);
  };

  const toggleEmployee = (id: string) => toggleFilter('employees', id, selectedEmployees);
  const toggleProject = (id: string) => toggleFilter('projects', id, selectedProjects);
  const togglePm = (id: string) => toggleFilter('pms', id, selectedPms);

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('employees');
    params.delete('projects');
    params.delete('pms');
    setSearchParams(params);
  };

  return {
    selectedEmployees,
    selectedProjects,
    selectedPms,

    toggleEmployee,
    toggleProject,
    togglePm,
    clearFilters,
    clearAllFilters,
    clearCategory,
  };
};
