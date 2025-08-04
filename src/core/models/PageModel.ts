export interface IPagination {
  take: number;
  page: number;
  total?: number;
  search?: string | null;
  orderBy?: string | null;
  direction?: string | null;
}
export const defaultPagination: IPagination = {
  take: 10,
  page: 0,
  search: null,
  total: 0,
};
