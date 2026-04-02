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
    TIME_LOGS: 'my-time-logs',
    EMPLOYEE_PROFILE: '/employee/profile',
    EMPLOYEE_TIME_LOGS: '/employee/my-time-logs',
  },

  MANAGER: {
    ROOT: '/manager',
    AI_CHAT: '/ai-chat',
    AI_CHAT_TRANSPORT: '/chat',
    TIME_LOGS: 'my-time-logs',
    MANAGER_TIME_LOGS: '/manager/my-time-logs',
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
