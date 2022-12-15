export const getLastPage = (listSize: number, totalCount: number): number => {
  return Math.ceil(totalCount / listSize);
};
