import { useCallback } from 'react';
import { addMonths, format, subMonths } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export const useMonthNavigation = (activeDate: Date) => {
  const [, setSearchParams] = useSearchParams();

  const updateDateInUrl = useCallback(
    (newDate: Date) => {
      setSearchParams({ date: format(newDate, 'yyyy-MM-dd') });
    },
    [setSearchParams]
  );

  const handlePrevMonth = useCallback(() => {
    updateDateInUrl(subMonths(activeDate, 1));
  }, [activeDate, updateDateInUrl]);

  const handleNextMonth = useCallback(() => {
    updateDateInUrl(addMonths(activeDate, 1));
  }, [activeDate, updateDateInUrl]);

  return { handlePrevMonth, handleNextMonth, updateDateInUrl };
};
