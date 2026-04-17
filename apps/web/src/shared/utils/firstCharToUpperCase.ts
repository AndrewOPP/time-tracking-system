export const firstCharToUpperCase = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalize = (str: string | undefined | null): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
