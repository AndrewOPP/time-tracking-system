export const calculatePercentage = (
  value: number,
  total: number,
  precision: number = 0
): number => {
  if (total <= 0) return 0;

  const percent = (value / total) * 100;
  const factor = Math.pow(10, precision);

  return Math.round(percent * factor) / factor;
};
