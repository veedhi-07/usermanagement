import { Button } from "flowbite-react";
import type { UserPaginationProps } from "../../types";
function UserPagination({
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
}: UserPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-6 items-center">
      <Button onClick={prevPage} disabled={currentPage === 1}>
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <Button
          key={number}
          onClick={() => goToPage(number)}
          color={number === currentPage ? "blue" : "gray"}
        >
          {number}
        </Button>
      ))}

      <Button onClick={nextPage} disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  );
}

export default UserPagination;
