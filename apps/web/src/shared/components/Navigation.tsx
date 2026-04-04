import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Timer,
  LogOut,
  UserCircle,
  PersonStanding,
  Bot,
  Calendar1,
  PersonStandingIcon,
  Menu,
} from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/shared/components/ui/sheet';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { logOut } from '../../modules/auth/api/auth.api';
import { cn } from '@/shared/lib/utils';
import { UserSystemRole } from '../types/user';
import type { navItem } from '../types/navigationTypes';

export const Navigation = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await logOut();
    if (error) {
      console.error('Server logout error:', error);
    }
    clearAuth();
    navigate(ROUTES.LOGIN, {
      replace: true,
      state: { from: null },
    });
  };

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    {
      label: 'Manager Dashboard',
      path: ROUTES.MANAGER.MANAGER_DASHBOARD,
      icon: Settings,
      systemRole: UserSystemRole.MANAGER,
    },
    {
      label: 'Time Tracking',
      path: ROUTES.MANAGER.MANAGER_TRACKING,
      icon: Timer,
      systemRole: UserSystemRole.MANAGER,
    },
    {
      label: 'AI Assistant',
      path: ROUTES.MANAGER.MANAGER_AI_CHAT,
      icon: Bot,
      systemRole: UserSystemRole.MANAGER,
    },
    {
      label: 'Employee Profile',
      path: ROUTES.EMPLOYEE.EMPLOYEE_PROFILE,
      icon: PersonStanding,
      systemRole: UserSystemRole.EMPLOYEE,
    },
    {
      label: 'My Time Logs',
      path:
        user.role === UserSystemRole.EMPLOYEE
          ? ROUTES.EMPLOYEE.EMPLOYEE_TIME_LOGS
          : ROUTES.MANAGER.MANAGER_TIME_LOGS,
      icon: Calendar1,
    },
    {
      label: 'My profile',
      path: ROUTES.USER.PROFILE,
      icon: PersonStandingIcon,
    },
  ];

  const generateNavItem = (item: navItem, isActive: boolean) => {
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all group',
          isActive
            ? 'bg-gray-100 text-slate-900 font-semibold'
            : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-slate-900'
        )}
      >
        <item.icon
          className={cn(
            'h-5 w-5 transition-colors',
            isActive ? 'text-slate-900' : 'text-gray-400 group-hover:text-slate-600'
          )}
        />
        {item.label}
      </Link>
    );
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      <div className="h-[56px] flex items-center justify-center px-4 shrink-0 border-b border-[#E5E5E5]">
        <span
          onClick={() => {
            navigate(ROUTES.ROOT);
            setIsMobileOpen(false);
          }}
          className="cursor-pointer font-extrabold text-3xl uppercase tracking-widest bg-gradient-to-r from-slate-900 via-gray-300 to-slate-900 bg-clip-text text-transparent animate-text-flow"
        >
          VISO Time
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
        {navItems.map(item => {
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          if (item.systemRole && item.systemRole === user.role) {
            return generateNavItem(item, isActive);
          }

          if (!item.systemRole) {
            return generateNavItem(item, isActive);
          }
          return null;
        })}
      </nav>

      <div className="p-4 border-t border-[#E5E5E5] bg-[#FAFAFA]">
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
          className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="text-sm font-medium">Log out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-[#FAFAFA] border-b border-[#E5E5E5] px-4 h-[56px] shrink-0 w-full z-40">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-[#E5E5E5]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            {renderNavContent()}
          </SheetContent>
        </Sheet>

        <span
          onClick={() => navigate(ROUTES.ROOT)}
          className="cursor-pointer font-extrabold text-xl uppercase tracking-widest bg-gradient-to-r from-slate-900 via-gray-300 to-slate-900 bg-clip-text text-transparent"
        >
          VISO Time
        </span>

        <div className="w-10" />
      </div>

      <aside className="hidden md:flex h-screen w-64 bg-[#FAFAFA] border-r border-[#E5E5E5] flex-col shrink-0 z-40">
        {renderNavContent()}
      </aside>
    </>
  );
};
