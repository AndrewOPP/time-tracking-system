import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { DashboardPage } from '../dashboard/pages/DashboardPage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';

export const EmployeeRoutes = () => (
  <Routes>
    <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeProfilePage />} />

    <Route path="*" element={<DashboardPage />} />
  </Routes>
);
