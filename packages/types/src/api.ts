export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: ApiError;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
