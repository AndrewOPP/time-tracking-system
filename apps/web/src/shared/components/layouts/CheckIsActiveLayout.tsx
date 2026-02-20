import { logOut } from '@/modules/auth/api/auth.api';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import UserIsNotActive from '@components/userIsNotActive';
import { Outlet } from 'react-router-dom';

export default function CheckIsActiveLayout() {
  const { user, clearAuth } = useAuthStore();

  const logout = async () => {
    await logOut();
    clearAuth();
  };

  if (user && !user.isActive) {
    return <UserIsNotActive onLogout={logout} />;
  }

  return <Outlet />;
}
