import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

import RequiredAuthLayout from '@/shared/components/layouts/RequiredAuthLayout';
import { EmployeeRoutes } from '@/modules/employee/router';
import { ManagerRoutes } from '@/modules/manager/router';
import { GeneralRoutes } from '@/modules/dashboard/router';

import { OAuthCallback } from '@/modules/auth/components/OAuthCallback';

import { UserSystemRole } from '../types/user';
import { CheckIsActiveLayout } from '@components/layouts/CheckIsActiveLayout';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { PublicOnlyLayout } from '@components/layouts/PublicOnlyLayout';
import { MainLayout } from '@components/layouts/MainLayout';
import { NotFoundPage } from '@components/NotFoundPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallback />} />

      <Route element={<PublicOnlyLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      <Route element={<RequiredAuthLayout />}>
        <Route element={<CheckIsActiveLayout />}>
          <Route element={<MainLayout />}>
            <Route element={<RequiredAuthLayout allowedRoles={[UserSystemRole.EMPLOYEE]} />}>
              <Route path={ROUTES.EMPLOYEE.ROOT + '/*'} element={<EmployeeRoutes />} />
            </Route>

            <Route element={<RequiredAuthLayout allowedRoles={[UserSystemRole.MANAGER]} />}>
              <Route path={ROUTES.MANAGER.ROOT + '/*'} element={<ManagerRoutes />} />
            </Route>

            <Route
              element={
                <RequiredAuthLayout
                  allowedRoles={[UserSystemRole.EMPLOYEE, UserSystemRole.MANAGER]}
                />
              }
            >
              <Route path="/*" element={<GeneralRoutes />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
