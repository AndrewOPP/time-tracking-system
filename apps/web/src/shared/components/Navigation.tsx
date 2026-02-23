import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Timer, LogOut, UserCircle, PersonStanding } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import { getUserProjects, logOut } from '../../modules/auth/api/auth.api';
import { cn } from '@/shared/lib/utils';
import { UserSystemRole } from '../types/user';
import type { navItem } from '../types/navigationTypes';
import { axiosPrivate } from '../api';

export const Navigation = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  const testApi = async () => {
    const projects = await getUserProjects();
    console.log(projects);
  };
  const testProjectsDetails = async () => {
    try {
      const projectDetails = await axiosPrivate.get(
        '/projects/63d0a349-3c7e-4199-9732-25d77efe78fd'
      );
      console.log(projectDetails);
    } catch (error) {
      console.log(error);
    }
  };

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
      label: 'Employee Profile',
      path: ROUTES.EMPLOYEE.EMPLOYEE_PROFILE,
      icon: PersonStanding,
      systemRole: UserSystemRole.EMPLOYEE,
    },
  ];

  const generateNavItem = (item: navItem, isActive: boolean) => {
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
        <item.icon className={cn('h-5 w-5', isActive ? 'text-indigo-600' : 'text-gray-500')} />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="h-screen w-64 bg-[#FAFAFA] border-r border-#E5E5E5 flex flex-col shrink-0 z-40">
      {/* 🌟 1. ДОБАВИЛИ ШАПКУ САЙДБАРА НА 56px */}
      {/* Она идеально совпадет с правым хедером контента */}
      <div className="h-[56px] flex items-center px-4 shrink-0 border-b-1 border-[#E5E5E5]"></div>

      {/* 🌟 2. ДОБАВИЛИ pt-4 (отступ сверху) и overflow-y-auto */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          if (item.systemRole && item.systemRole === user.role) {
            return generateNavItem(item, isActive);
          }

          if (!item.systemRole) {
            return generateNavItem(item, isActive);
          }
        })}
        <Button onClick={() => testApi()}>Test API</Button>
        <Button onClick={() => testProjectsDetails()}>Test Projects Details</Button>
      </nav>

      {/* Нижняя часть с профилем остается без изменений */}
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
