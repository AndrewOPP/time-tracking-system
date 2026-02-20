import { Routes, Route } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import PublicOnlyLayout from '@/shared/components/layouts/PublicOnlyLayout';
import RequiredAuthLayout from '@/shared/components/layouts/RequiredAuthLayout';
import { EmployeeRoutes } from '@/modules/employee/router';
import { ManagerRoutes } from '@/modules/manager/router';
import { GeneralRoutes } from '@/modules/home/router';
import LoginPage from '@/modules/auth/pages/LoginPage';
import { OAuthCallback } from '@/modules/auth/components/OAuthCallback';
import NotFoundPage from '@components/NotFoundPage';
import { UserSystemRole } from '../types/user';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallback />} />
      </Route>

      <Route element={<RequiredAuthLayout allowedRoles={[UserSystemRole.EMPLOYEE]} />}>
        <Route path="/employee/*" element={<EmployeeRoutes />} />
      </Route>

      <Route element={<RequiredAuthLayout allowedRoles={[UserSystemRole.MANAGER]} />}>
        <Route path="/manager/*" element={<ManagerRoutes />} />
      </Route>

      <Route element={<RequiredAuthLayout />}>
        <Route path="/*" index element={<GeneralRoutes />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
