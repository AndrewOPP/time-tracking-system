import { useCallback } from 'react';
import { addWeeks, format, subWeeks } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export const useWeekNavigation = (activeDate: Date) => {
  const [, setSearchParams] = useSearchParams();

  const updateDateInUrl = useCallback(
    (newDate: Date) => {
      setSearchParams({ date: format(newDate, 'yyyy-MM-dd') });
    },
    [setSearchParams]
  );

  const handlePrevWeek = useCallback(() => {
    updateDateInUrl(subWeeks(activeDate, 1));
  }, [activeDate, updateDateInUrl]);

  const handleNextWeek = useCallback(() => {
    updateDateInUrl(addWeeks(activeDate, 1));
  }, [activeDate, updateDateInUrl]);

  return { handlePrevWeek, handleNextWeek, updateDateInUrl };
};
