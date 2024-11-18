export interface PaginateMeta {
  offset: number;
  limit: number;
  total: number;
}

export interface PaginatedList<T> {
  data: T[];
  meta: PaginateMeta;
}
