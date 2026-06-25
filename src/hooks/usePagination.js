import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/appConstants';

export const usePagination = (initialPageSize = DEFAULT_PAGE_SIZE) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [ascending, setAscending] = useState(true);

  // Memoized to prevent useEffect deps from re-triggering on every render
  const queryInfo = useMemo(
    () => ({
      pageIndex,
      pageSize,
      sortFields: sortField ? [sortField] : [],
      ascending,
      predicate: null,
      paramValues: [],
    }),
    [pageIndex, pageSize, sortField, ascending]
  );

  const handlePageChange = useCallback((newPage) => setPageIndex(newPage), []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setPageIndex(0);
  }, []);

  const handleSortChange = useCallback((field, asc) => {
    setSortField(field ?? null);
    setAscending(asc);
    setPageIndex(0);
  }, []);

  const applySearchResult = useCallback((searchResult) => {
    setTotalItems(searchResult?.totalItems ?? 0);
    return searchResult?.items ?? [];
  }, []);

  const resetPagination = useCallback(() => {
    setPageIndex(0);
    setTotalItems(0);
  }, []);

  return {
    queryInfo,
    pageIndex,
    pageSize,
    totalItems,
    ascending,
    setTotalItems,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    applySearchResult,
    resetPagination,
  };
};
