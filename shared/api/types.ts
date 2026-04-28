export type ApiErrorBody = {
  statusCode: number;
  message: string;
  details: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  error: ApiErrorBody | null;
  data: T;
};

export type ApiPaginationData<T> = {
  page: number;
  totalSize: number;
  list: T[];
};

export enum SortOrder {
  desc = "desc",
  asc = "asc",
}

export type TApiPagination<S> = {
  page: number;
  pageSize: number;
  sortBy: S;
  sortOrder: SortOrder;
};
