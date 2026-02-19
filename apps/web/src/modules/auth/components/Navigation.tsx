import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button'; // якщо використовуєш shadcn
import { useAuthStore } from '../stores/auth.store';
import { logOut } from '../api/auth.api';

export const Navigation = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate(ROUTES.AUTH.LOGIN);
    } catch {
      return null;
    } finally {
      clearAuth();
    }
  };

  if (!user) return null; // Не показуємо навігацію гостям

  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900 text-white shadow-md">
      <div className="flex gap-6">
        {/* Загальні посилання для всіх (Employee, Manager і т.д.) */}
        <Link to="/bashboard" className="hover:text-blue-400 transition">
          Dashboard
        </Link>
        <Link to={ROUTES.HOME} className="hover:text-blue-400 transition">
          home
        </Link>

        <div className="w-[1px] h-6 bg-slate-700 mx-2" />
        <Link to="/manager/dashboard" className="text-amber-400 hover:text-amber-300 transition">
          Менеджер Панель
        </Link>
        <Link
          to="/manager/time-tracking"
          className="text-amber-400 hover:text-amber-300 transition"
        >
          Тайм-трекінг
        </Link>

        {/* Сценарій 6: Посилання тільки для Менеджерів */}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-400">
          Ви увійшли як: <span className="text-white font-medium">{user.role}</span>
        </div>
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          Вийти
        </Button>
      </div>
    </nav>
  );
};
