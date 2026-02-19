import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
// import { useEffect } from 'react';

export default function PublicOnlyLayout() {
  const { user } = useAuthStore();
  // useEffect(() => {
  //   if (user && intendedUrl) {
  //     setIntendedUrl(null);
  //   }
  // }, [user, intendedUrl, setIntendedUrl]);

  if (user) {
    const defaultDashboard = user.role === 'MANAGER' ? '/manager/dashboard' : ROUTES.HOME;
    // const destination = intendedUrl || defaultDashboard;
    return <Navigate to={defaultDashboard} replace />;
  }

  return <Outlet />;
}
