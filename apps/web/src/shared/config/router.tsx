import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoutes } from '@/modules/auth/router';
import { HomePage } from '@/modules/home/pages/HomePage';
import { ROUTES } from '../constants/routes';
import PublicOnlyLayout from '@/shared/components/layouts/PublicOnlyLayout';
import RequiredAuthLayout from '@/shared/components/layouts/RequiredAuthLayout';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyLayout />}>
        <Route path="/*" element={<AuthRoutes />} />
      </Route>

      <Route element={<RequiredAuthLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<RequiredAuthLayout allowedRoles={['MANAGER', 'ADMIN']} />}>
        <Route path="manager/dashboard" element={<div>Manager Dashboard Content</div>} />
        <Route path="manager/time-tracking" element={<div>Manager Time Tracking Content</div>} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
