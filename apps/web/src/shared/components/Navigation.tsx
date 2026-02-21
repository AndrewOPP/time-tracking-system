import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Timer, LogOut, UserCircle, PersonStanding } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { logOut } from '../../modules/auth/api/auth.api';
import { cn } from '@/shared/lib/utils';

export const Navigation = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { from: null },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Manager Dashboard', path: ROUTES.MANAGER.MANAGER_DASHBOARD, icon: Settings },
    { label: 'Time Tracking', path: ROUTES.MANAGER.MANAGER_TRACKING, icon: Timer },
    { label: 'Employee Profile', path: ROUTES.EMPLOYEE.EMPLOYEE_PROFILE, icon: PersonStanding },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 bg-[#ebebeb] border-r border-gray-300 flex flex-col shrink-0 z-40">
      <div className="h-12" />

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-black'
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive ? 'text-indigo-600' : 'text-gray-500')}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-300 bg-[#ebebeb]">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <UserCircle className="h-6 w-6 text-gray-400 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.email?.split('@')[0] || 'Account'}
            </p>
            <p className="text-xs text-gray-500 capitalize leading-none">{user.role}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="text-sm font-medium">Log out</span>
        </Button>
      </div>
    </aside>
  );
};
