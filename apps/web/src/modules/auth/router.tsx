import type { RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { OAuthCallback } from './components/OAuthCallback';
import { ROUTES } from '@/shared/constants/routes';

export const authRoutes: RouteObject[] = [
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.CALLBACK,
    element: <OAuthCallback />,
  },
];
