export const ROUTES = {
  ROOT: '/',

  LOGIN: '/login',
  OAUTH_CALLBACK: '/oauth/callback',

  DASHBOARD: '/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  ACCOUNTANT_DASHBOARD: '/accountant/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',

  EMPLOYEE: {
    ROOT: '/employee',
    PROFILE: 'profile',
    EMPLOYEE_PROFILE: '/employee/profile',
  },

  MANAGER: {
    ROOT: '/manager',
    DASHBOARD: 'dashboard',
    MANAGER_DASHBOARD: '/manager/dashboard',
    TIME_TRACKING: 'time-tracking',
    MANAGER_TRACKING: '/manager/time-tracking',
  },

  HR: {
    ROOT: '/hr',
    DASHBOARD: 'dashboard',
  },

  ACCOUNTANT: {
    ROOT: '/accountant',
    DASHBOARD: 'dashboard',
  },

  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: 'dashboard',
  },
} as const;
