import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

import EmployeeProfilePage from './pages/EmployeeProfilePage';
import DashboardPage from '../home/pages/DashboardPage';

export const EmployeeRoutes = () => (
  <Routes>
    <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeProfilePage />} />

    <Route path="*" element={<DashboardPage />} />
  </Routes>
);
