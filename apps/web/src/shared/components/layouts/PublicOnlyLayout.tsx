import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';

export default function PublicOnlyLayout() {
  const { user, intendedUrl } = useAuthStore();

  if (user) {
    const defaultDashboard = user.role === 'MANAGER' ? '/manager/dashboard' : ROUTES.ROOT;
    const destination = intendedUrl || defaultDashboard;

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
