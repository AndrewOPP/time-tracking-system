import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthRoutes } from '@/modules/auth/router'; // Тепер це компонент
import { HomePage } from '@/modules/home/pages/HomePage';
import { ROUTES } from '../constants/routes';
import PublicOnlyLayout from '@/shared/components/layouts/PublicOnlyLayout';
import RequiredAuthLayout from '@/shared/components/layouts/RequiredAuthLayout';

export const AppRouter = () => {
  return (
    <Routes>
      {/* <Route element={<PublicOnlyLayout />}> */}

      {/* <Route path="auth/*" element={<AuthRoutes />} /> */}
      {/* <Route path="auth/*" element={<AuthRoutes />} />, 

      {/* </Route> */}

      {/* <Route element={<RequiredAuthLayout />}> */}
      <Route index element={<HomePage />} />
      {/* </Route> */}

      {/* <Route path="manager" element={<RequiredAuthLayout allowedRoles={['MANAGER', 'ADMIN']} />}> */}
      {/* <Route path="dashboard" element={<div>Manager Dashboard Content</div>} />
      <Route path="time-tracking" element={<div>Manager Time Tracking Content</div>} /> */}
      {/* </Route> */}

      {/* <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} /> */}
    </Routes>
  );
};
