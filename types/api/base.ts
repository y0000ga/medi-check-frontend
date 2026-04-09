export interface IPaginationResponse<T> {
  page: number;
  total_size: number;
  list: T[];
}

export type TPaginationParams =  {
  page: number;
  page_size: number;
  sort_by: string;
  sort_order: "desc" | "asc";
};
