export const buildPath = (...args: (string | number | null | undefined)[]): string => {
  const processedElements = args
    .filter(arg => arg !== null && arg !== undefined && arg !== '')
    .map(String)
    .map(part => part.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);

  return `/${processedElements.join('/')}`;
};
