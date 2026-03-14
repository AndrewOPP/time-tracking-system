import { PageHeader } from '@components/PageHeader';
import { useUsersData } from '../hooks/useUsersData';
import { endOfMonth, format, startOfMonth } from 'date-fns';

export function ManagerTimeTrachingPage() {
  const from = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const to = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const { data } = useUsersData(from, to, 'a.vyblov2003@gmail.com');
  if (data) {
    console.log(data);
  }

  return (
    <div>
      <PageHeader
        title="Облік часу працівників"
        description="Тут ви можете переглядати відпрацьований час співробітників і швидко фільтрувати дані за необхідними критеріями."
      />

      <button onClick={() => {}}>TEST API</button>
    </div>
  );
}
