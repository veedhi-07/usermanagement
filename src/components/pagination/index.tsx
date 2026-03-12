import { useState, useEffect } from "react";
import { Button } from "flowbite-react";

interface PaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

function UserPagination<T>({
  data,
  itemsPerPage = 7,
  onPageChange,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6 items-center">
      {/* Previous */}
      <Button
      className="cursor-pointer"
        color="gray"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <Button
        className="cursor-pointer"
          key={number}
          onClick={() => handlePageChange(number)}
          color={number === currentPage ? "blue" : "gray"}
        >
          {number}
        </Button>
      ))}

      {/* Next */}
      <Button
      className="cursor-pointer"
        color="gray"
        onClick={() =>
          handlePageChange(Math.min(currentPage + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

export default UserPagination;
