import { useState, useCallback } from 'react';
import { ApiError } from '../types/api.types';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T, Args extends any[]>(
  apiFunc: (...args: Args) => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (err: any) {
        const apiErr: ApiError = err.statusCode
          ? err
          : {
              statusCode: 500,
              errorCode: 'UNKNOWN_ERROR',
              message: err.message || 'An unexpected error occurred.',
            };
        setError(apiErr);
        if (options.onError) {
          options.onError(apiErr);
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
    setData,
  };
};
