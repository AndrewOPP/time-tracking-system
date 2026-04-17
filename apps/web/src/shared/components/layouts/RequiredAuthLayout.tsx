import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { useToast } from '@hooks/use-toast';
import { AUTH_ERROR_MAP } from '@/shared/constants/errors.messages';

interface Props {
  allowedRoles?: string[];
}

export default function RequiredAuthLayout({ allowedRoles }: Props) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const location = useLocation();
  const [wasLoggedIn] = useState(() => !!user);

  const hasUser = !!user;
  const hasAccess = !allowedRoles || (hasUser && allowedRoles.includes(user.role));
  const isLogout = wasLoggedIn && !hasUser;

  useEffect(() => {
    if (hasUser && !hasAccess) {
      toast({
        title: 'Access denied',
        description: AUTH_ERROR_MAP.AUTH_NO_PERMISSION,
        variant: 'destructive',
      });
    }
  }, [hasUser, hasAccess, toast]);

  if (!hasUser) {
    return <Navigate to={ROUTES.LOGIN} replace state={isLogout ? null : { from: location }} />;
  }

  if (!hasAccess) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <Outlet />;
}
