import { useCallback, useState } from 'react';
import { DEFAULT_PAGE_LIMIT } from '../utils/constants';

export const usePagination = (initialLimit = DEFAULT_PAGE_LIMIT) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const goToPage = useCallback((targetPage: number) => {
    const validPage = Math.max(1, Math.min(targetPage, totalPages || 1));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage((prev) => prev + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage((prev) => prev - 1);
  }, [hasPrevPage]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setTotalCount(0);
  }, []);

  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
    setTotalCount,
    resetPagination,
  };
};
