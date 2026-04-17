import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { UserSystemRole } from '@/shared/types/user';

export function PublicOnlyLayout() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user) {
    const defaultDashboard =
      user.role === UserSystemRole.MANAGER ? ROUTES.MANAGER.MANAGER_DASHBOARD : ROUTES.ROOT;

    const destination = location.state?.from?.pathname
      ? location.state?.from?.pathname
      : defaultDashboard;

    return <Navigate to={destination} replace state={{ from: null }} />;
  }

  return <Outlet />;
}
