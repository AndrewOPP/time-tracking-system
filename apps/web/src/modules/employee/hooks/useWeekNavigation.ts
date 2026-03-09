import { useCallback } from 'react';
import { addWeeks, subWeeks } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export const useWeekNavigation = (activeDate: Date) => {
  const [, setSearchParams] = useSearchParams();

  const updateDateInUrl = useCallback(
    (newDate: Date) => {
      setSearchParams({ date: newDate.toISOString().split('T')[0] });
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
