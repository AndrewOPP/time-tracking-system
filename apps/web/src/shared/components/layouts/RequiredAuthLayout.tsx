import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const wasLoggedIn = useRef(!!user);

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      toast({
        title: 'Access denied',
        description: AUTH_ERROR_MAP.AUTH_NO_PERMISSION,
        variant: 'destructive',
      });
      navigate(ROUTES.ROOT, { replace: true });
    }

    if (!user) {
      const isLogout = wasLoggedIn.current;

      navigate(ROUTES.LOGIN, {
        replace: true,
        state: isLogout ? null : { from: location },
      });
    }

    wasLoggedIn.current = !!user;
  }, [user, allowedRoles, toast, navigate, location]);

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <Outlet />;
}
