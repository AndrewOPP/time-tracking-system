export const ROUTES = {
  ROOT: '/',

  LOGIN: '/login',
  OAUTH_CALLBACK: '/oauth/callback',

  DASHBOARD: '/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  ACCOUNTANT_DASHBOARD: '/accountant/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  PROJECT_DETAILS: '/dashboard/project',
  DASHBOARD_PROJECTS: '/dashboard/:id',
  PROJECTS: '/projects',

  EMPLOYEE: {
    ROOT: '/employee',
    PROFILE: 'profile',
    EMPLOYEE_PROFILE: '/employee/profile',
  },

  MANAGER: {
    ROOT: '/manager',
    AI_CHAT: '/ai-chat',
    MANAGER_AI_CHAT: '/manager/ai-chat',
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
