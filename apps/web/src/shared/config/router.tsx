import { authRoutes } from '@/modules/auth/router';
import { HomePage } from '@/modules/home/pages/HomePage';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',

    children: [
      ...authRoutes,
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);
