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

export const COLUMN_WIDTHS = {
  employee: 'w-[230px]',
  projects: 'w-[250px]',
  week: 'w-[120px]',
  perProjectTotal: 'w-[130px]',
  total: 'w-[70px]',
  pm: 'w-[160px]',
} as const;
