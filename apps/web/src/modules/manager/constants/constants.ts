import {
  Briefcase,
  Calculator,
  CalendarOff,
  Clock,
  MonitorSmartphone,
  Timer,
  UserCog,
  Users,
} from 'lucide-react';

export const messageStatusTypes = {
  LIKED: 'liked',
  DISLIKED: 'disliked',
  NEUTRAL: 'neutral',
};

export const SUGGESTIONS = [
  { id: '01', text: 'Find developers with React experience' },
  { id: '02', text: 'Which employees are currently available?' },
  { id: '03', text: 'Find available backend developers' },
];

export const PROJECT_TYPE = {
  billable: 'BILLABLE',
  nonBillable: 'NON_BILLABLE',
} as const;
export type ProjectTypeValue = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];

export const COLUMN_WIDTHS = {
  employee: 'w-[230px]',
  projects: 'w-[250px]',
  week: 'w-[120px]',
  perProjectTotal: 'w-[130px]',
  total: 'w-[70px]',
  pm: 'w-[160px]',
} as const;

export const BAR_CONFIG = {
  colors: {
    billable: '#4B8A67',
    nonBillable: '#1F1F1F',
    untracked: {
      text: '#747474',
      bg: '#D2D2D2',
    },
    overtime: '#CE2225',
    textDefault: '#1F1F1F',
  },
  titles: {
    billable: 'Billable',
    nonBillable: 'Non-billable',
    untracked: 'Untracked',
    overtime: 'Overtime',
  },
  dimensions: {
    gap: 'gap-[2px]',
    radius: 'rounded-[2px]',
  },
} as const;

export const EMPLOYMENT_FORMAT = {
  fullTime: 'FULL_TIME',
  partTime: 'PART_TIME',
} as const;

export type EmploymentFormatValue = (typeof EMPLOYMENT_FORMAT)[keyof typeof EMPLOYMENT_FORMAT];

export const FILTER_PARAM_KEYS = {
  EMPLOYEES: 'employees',
  PROJECTS: 'projects',
  FORMAT: 'format',
  PMS: 'pms',
} as const;

export const CATEGORY_TYPE = {
  list: 'list',
  range: 'range',
} as const;

export const RANGE_FILTER_KEYS = {
  TOTAL: 'total',
  PTO: 'pto',
  EMPLOYED_PERCENT: 'employedPercent',
} as const;

export type CategoryTypeValue = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export const CATEGORIES = [
  { id: FILTER_PARAM_KEYS.EMPLOYEES, label: 'Employee', icon: Users, type: CATEGORY_TYPE.list },
  { id: FILTER_PARAM_KEYS.PROJECTS, label: 'Projects', icon: Briefcase, type: CATEGORY_TYPE.list },

  { id: 'week1', label: 'Week 1', icon: Timer, type: CATEGORY_TYPE.range },
  { id: 'week2', label: 'Week 2', icon: Timer, type: CATEGORY_TYPE.range },
  { id: 'week3', label: 'Week 3', icon: Timer, type: CATEGORY_TYPE.range },
  { id: 'week4', label: 'Week 4', icon: Timer, type: CATEGORY_TYPE.range },
  { id: 'week5', label: 'Week 5', icon: Timer, type: CATEGORY_TYPE.range },
  { id: 'week6', label: 'Week 6', icon: Timer, type: CATEGORY_TYPE.range },

  { id: RANGE_FILTER_KEYS.TOTAL, label: 'Total', icon: Calculator, type: CATEGORY_TYPE.range },
  {
    id: RANGE_FILTER_KEYS.EMPLOYED_PERCENT,
    label: 'Employed Time %',
    icon: Clock,
    type: CATEGORY_TYPE.range,
  },
  { id: RANGE_FILTER_KEYS.PTO, label: 'PTO Hours', icon: CalendarOff, type: CATEGORY_TYPE.range },

  { id: FILTER_PARAM_KEYS.PMS, label: 'PM', icon: UserCog, type: CATEGORY_TYPE.list },
  {
    id: FILTER_PARAM_KEYS.FORMAT,
    label: 'Format',
    icon: MonitorSmartphone,
    type: CATEGORY_TYPE.list,
  },
] as const;

export const FILTER_CONFIG = {
  employee: {
    caseAndKey: 'employees',
    idKey: 'employeeName',
    nameKey: 'employeeName',
    avatarKey: 'avatarUrl',
    placeholder: 'Search employee',
    emptyText: 'No employees found',
  },
  projects: {
    caseAndKey: 'projects',
    idKey: 'projectId',
    nameKey: 'projectName',
    avatarKey: 'projectAvatarUrl',
    placeholder: 'Search project',
    emptyText: 'No projects found',
  },
  pm: {
    caseAndKey: 'pms',
    idKey: 'pmName',
    nameKey: 'pmName',
    avatarKey: 'pmAvatarUrl',
    placeholder: 'Search manager',
    emptyText: 'No managers found',
  },
  format: {
    caseAndKey: 'format',
  },
} as const;

export const RANGE_MIN_MAX = {
  min: 'min',
  max: 'max',
} as const;

export type RangeType = (typeof RANGE_MIN_MAX)[keyof typeof RANGE_MIN_MAX];

export const VALID_RANGE_OPTIONS_CONFIG = {
  range_items_count: 21,
  range_step: 10,
};

export const FILTER_ALL_VALUE = 'all';

export const AI_CHAT_PAGE_CONFIG = {
  experimental_throttle: 50,
};
