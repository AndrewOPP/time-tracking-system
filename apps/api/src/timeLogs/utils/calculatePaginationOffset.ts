export const calculatePaginationOffset = (page: number, limit: number): number => {
  const safePage = Math.max(1, page);
  return (safePage - 1) * limit;
};
