import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { OAuthCallback } from './components/OAuthCallback';
import { ROUTES } from '@/shared/constants/routes';

export const AuthRoutes = () => (
  <>
    <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
    <Route path={ROUTES.AUTH.CALLBACK} element={<OAuthCallback />} />
  </>
);
