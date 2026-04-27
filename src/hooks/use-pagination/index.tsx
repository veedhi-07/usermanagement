import { useMemo, useState, useEffect, useCallback } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export default function usePagination<T>({
  data,
  itemsPerPage,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / itemsPerPage));
  }, [data.length, itemsPerPage]);

  //  Prevent invalid page when data shrinks
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

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
  };
}
