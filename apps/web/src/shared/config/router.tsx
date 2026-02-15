import { authRoutes } from '@/modules/auth/router';
import { HomePage } from '@/modules/home/pages/HomePage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,

    children: [
      ...authRoutes,
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
      },
    ],
  },
]);
