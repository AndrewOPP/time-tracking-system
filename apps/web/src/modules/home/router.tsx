import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';

export const GeneralRoutes = () => (
  <Routes>
    <Route path={ROUTES.ROOT} element={<HomePage />} />
    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

    <Route path="*" element={<DashboardPage />} />
  </Routes>
);
