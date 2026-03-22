import { useSearchParams } from 'react-router-dom';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getString = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getNumber = (key: string): number | null => {
    const value = searchParams.get(key);
    if (value === null) return null;

    const num = Number(value);
    return isNaN(num) ? null : num;
  };

  const getSet = (key: string): Set<string> => {
    const value = searchParams.get(key);
    return new Set(value ? value.split(',') : []);
  };

  const setValue = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams);

    if (value !== null && value !== '') {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  const setSet = (key: string, set: Set<string>) => {
    const params = new URLSearchParams(searchParams);

    if (set.size > 0) {
      params.set(key, Array.from(set).join(','));
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  const toggleInSet = (key: string, value: string) => {
    const current = getSet(key);
    const newSet = new Set(current);

    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);

    setSet(key, newSet);
  };

  const deleteKey = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  const clearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    getString,
    getNumber,
    getSet,
    setValue,
    setSet,
    toggleInSet,
    deleteKey,
    clearAll,
    searchParams,
  };
};
