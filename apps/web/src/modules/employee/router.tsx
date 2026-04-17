import { Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { DashboardPage } from '../dashboard/pages/DashboardPage';
import { EmployeeProfilePage } from './pages/EmployeeProfilePage';
import MyTimeLogsPage from './pages/MyTimeLogsPage';

export const EmployeeRoutes = () => (
  <Routes>
    <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeProfilePage />} />
    <Route path={ROUTES.EMPLOYEE.TIME_LOGS} element={<MyTimeLogsPage />} />

    <Route path="*" element={<DashboardPage />} />
  </Routes>
);
