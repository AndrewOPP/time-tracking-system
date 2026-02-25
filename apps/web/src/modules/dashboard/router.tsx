import { Route, Routes, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { UserSystemRole } from '@/shared/types/user';
import HomePage from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';

export const GeneralRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              user?.role === UserSystemRole.MANAGER
                ? ROUTES.MANAGER.MANAGER_DASHBOARD
                : ROUTES.DASHBOARD
            }
            replace
          />
        }
      />

      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.DASHBOARD + '/:id'} element={<ProjectDetailsPage />} />
      <Route path={'/home'} element={<HomePage />} />

      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};
