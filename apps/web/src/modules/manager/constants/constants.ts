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
