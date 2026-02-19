import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
// import { ROUTES } from '@/shared/constants/routes';
// import { useEffect } from 'react';

export default function PublicOnlyLayout() {
  const { status } = useAuthStore();

  // useEffect(() => {
  //   if (user && intendedUrl) {
  //     setIntendedUrl(null);
  //   }
  // }, [user, intendedUrl, setIntendedUrl]);

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (status === 'authenticated') {
    // const defaultDashboard = user.role === 'MANAGER' ? '/manager/dashboard' : ROUTES.HOME;
    // const destination = intendedUrl || defaultDashboard;
    // return <Navigate to={'/'} replace />;
  }

  return <Outlet />;
}
