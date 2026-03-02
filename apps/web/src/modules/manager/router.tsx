import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { ManagerAIChatPage } from './pages/ManagerAIChatPage';
import { ManagerTimeTrachingPage } from './pages/ManagerTimeTrachingPage';
import { ManagerDashboardPage } from './pages/ManagerDashboardPage';

export const ManagerRoutes = () => (
  <Routes>
    <Route path={ROUTES.MANAGER.DASHBOARD} element={<ManagerDashboardPage />} />
    <Route path={ROUTES.MANAGER.TIME_TRACKING} element={<ManagerTimeTrachingPage />} />
    <Route path={ROUTES.MANAGER.AI_CHAT} element={<ManagerAIChatPage />} />

    <Route path="*" element={<ManagerDashboardPage />} />
  </Routes>
);
