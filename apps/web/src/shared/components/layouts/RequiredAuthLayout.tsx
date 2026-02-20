import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { Navigation } from '@components/Navigation';
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

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      toast({
        title: 'Access denied',
        description: AUTH_ERROR_MAP.AUTH_NO_PERMISSION,
        variant: 'destructive',
      });
      navigate(ROUTES.ROOT, { replace: true });
    }
  }, [user, allowedRoles, toast, navigate]);

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (!allowedRoles) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Navigation />

      <main className="flex-1 min-h-screen transition-all duration-300 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
