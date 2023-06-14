export type Target<T = unknown> = new (...args: any[]) => T;
export type Paginated<T> = {
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  items: Array<T>;
};
