export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  hasNextPage?: boolean;
}

export interface ApiError {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: Record<string, any>;
}
