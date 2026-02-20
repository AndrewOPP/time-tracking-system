// shared/constants/routes.ts

export const ROUTES = {
  ROOT: '/',

  // Public
  LOGIN: '/login',
  OAUTH_CALLBACK: '/oauth/callback',

  // Default dashboards
  DASHBOARD: '/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  ACCOUNTANT_DASHBOARD: '/accountant/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',

  // Employee routes
  EMPLOYEE: {
    ROOT: '/employee',
    PROFILE: 'profile',
  },

  // Manager routes
  MANAGER: {
    ROOT: '/manager',
    DASHBOARD: 'dashboard',
    TIME_TRACKING: 'time-tracking',
  },

  // HR routes
  HR: {
    ROOT: '/hr',
    DASHBOARD: 'dashboard',
  },

  // Accountant routes
  ACCOUNTANT: {
    ROOT: '/accountant',
    DASHBOARD: 'dashboard',
  },

  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: 'dashboard',
  },
} as const;
