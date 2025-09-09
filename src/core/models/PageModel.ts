export interface IPagination {
  take: number;
  page: number;
  total?: number;
  search?: string | null;
  orderBy?: string | null;
  direction?: string | null;
  // Blog service için ek parametreler
  languageCode?: string | null;
  categoryId?: string | null;
  languageId?: string | null;
}
export const defaultPagination: IPagination = {
  take: 10,
  page: 0,
  search: null,
  total: 0,
  orderBy: null,
  direction: null,
  languageCode: null,
  categoryId: null,
  languageId: null,
};
