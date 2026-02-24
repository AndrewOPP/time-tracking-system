export const statusConfigLabel = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
  NOT_STARTED: 'Not Started',
  PAUSED: 'Paused',
} as const;

export const statusConfig: Record<string, { bg: string; dot: string; label: string }> = {
  COMPLETED: { bg: 'bg-[#E5EFFF]', dot: 'bg-blue-500', label: statusConfigLabel.COMPLETED },
  IN_PROGRESS: { bg: 'bg-[#E5F6E5]', dot: 'bg-green-500', label: statusConfigLabel.IN_PROGRESS },
  NOT_STARTED: { bg: 'bg-gray-100', dot: 'bg-gray-400', label: statusConfigLabel.NOT_STARTED },
  PAUSED: { bg: 'bg-[#FFF0E5]', dot: 'bg-orange-500', label: statusConfigLabel.PAUSED },
};
