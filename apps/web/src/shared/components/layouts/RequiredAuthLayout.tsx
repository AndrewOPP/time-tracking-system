import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { useEffect } from 'react';

interface Props {
  allowedRoles?: string[];
}

export default function RequiredAuthLayout({ allowedRoles }: Props) {
  const { user, setIntendedUrl } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const fullPath = location.pathname + location.search;
      setIntendedUrl(fullPath);
    }
  }, [user, setIntendedUrl, location.pathname, location.search]);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <Outlet />;
}
