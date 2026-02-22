import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManagerTimeTrachingPage from './pages/ManagerTimeTrachingPage';

export const ManagerRoutes = () => (
  <Routes>
    <Route path={ROUTES.MANAGER.DASHBOARD} element={<ManagerDashboardPage />} />
    <Route path={ROUTES.MANAGER.TIME_TRACKING} element={<ManagerTimeTrachingPage />} />

    <Route path="*" element={<ManagerDashboardPage />} />
  </Routes>
);
