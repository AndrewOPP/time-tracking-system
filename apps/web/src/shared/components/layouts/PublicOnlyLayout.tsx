import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { UserSystemRole } from '@/shared/types/user';

export default function PublicOnlyLayout() {
  const { user } = useAuthStore();

  if (user) {
    const defaultDashboard =
      user.role === UserSystemRole.MANAGER ? ROUTES.MANAGER.MANAGER_DASHBOARD : ROUTES.ROOT;
    return <Navigate to={defaultDashboard} replace state={{ from: null }} />;
  }

  return <Outlet />;
}
