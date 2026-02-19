import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
// import { useEffect } from 'react';

interface Props {
  allowedRoles?: string[];
}

export default function RequiredAuthLayout({ allowedRoles }: Props) {
  const { user, status } = useAuthStore();
  // const location = useLocation();

  // const isUnauthorized = !isInitializing && !user;

  // useEffect(() => {
  //   if (isUnauthorized) {
  //     const fullPath = location.pathname + location.search;
  //     // setIntendedUrl(fullPath);
  //   }
  // }, [isUnauthorized, location.pathname, location.search]);

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  if (status === 'unauthenticated') {
    // return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    // return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
