export type PaginationDto = {
  pagination?: boolean | null;
  page?: number | null;
  pageSize?: number | null;
  bulkSize?: number | null;
};

export type Pagination = {
  total: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
  pageCursor: string | number | null;
  pageSize: number;
};

export type PaginationResponse<T = unknown> = {
  data: T[];
  pagination: Pagination;
};
