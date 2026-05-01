import { useMemo, useState, useEffect, useCallback } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  totalCount: number;
}

export default function usePagination<T>({
  data,
  itemsPerPage,
  totalCount,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(itemsPerPage);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / limit));
  }, [totalCount,limit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    return data.slice(start, end);
  }, [data, currentPage, limit]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(() => {
        if (page < 1) return 1;
        if (page > totalPages) return totalPages;
        return page;
      });
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage,
    limit,
    setLimit,
    totalCount,
  };
}
