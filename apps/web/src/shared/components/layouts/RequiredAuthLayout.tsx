import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';

// import { useEffect } from 'react';

interface Props {
  allowedRoles?: string[];
}

export default function RequiredAuthLayout({ allowedRoles }: Props) {
  const { user } = useAuthStore();
  // const location = useLocation();

  // const isUnauthorized = !isInitializing && !user;

  // useEffect(() => {
  //   if (isUnauthorized) {
  //     const fullPath = location.pathname + location.search;
  //     // setIntendedUrl(fullPath);
  //   }
  // }, [isUnauthorized, location.pathname, location.search]);

  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Відправляємо на головну або показуємо сторінку "403 No Access"
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
