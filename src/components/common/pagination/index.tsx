import type { PaginationProps } from "../../../types";
function UserPagination({
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  limit,
  setLimit,
  totalCount,
  label = "",
  prevPage,
}: PaginationProps) {
  return (
    <>
      <div className="grid grid-cols-3 justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Items per page:
          </span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              goToPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 sm:p-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.58203 9.99868C2.58174 10.1909 2.6549 10.3833 2.80152 10.53L7.79818 15.5301C8.09097 15.8231 8.56584 15.8233 8.85883 15.5305C9.15183 15.2377 9.152 14.7629 8.85921 14.4699L5.13911 10.7472L16.6665 10.7472C17.0807 10.7472 17.4165 10.4114 17.4165 9.99715C17.4165 9.58294 17.0807 9.24715 16.6665 9.24715L5.14456 9.24715L8.85919 5.53016C9.15199 5.23717 9.15184 4.7623 8.85885 4.4695C8.56587 4.1767 8.09099 4.17685 7.79819 4.46984L2.84069 9.43049C2.68224 9.568 2.58203 9.77087 2.58203 9.99715C2.58203 9.99766 2.58203 9.99817 2.58203 9.99868Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium
            ${
              currentPage === number
                ? "bg-brand-500 text-white"
                : " text-gray-700 dark:text-gray-400 dark:hover:text-white"
            }`}
              key={number}
              onClick={() => goToPage(number)}
            >
              {number}
            </button>
          ))}

          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 sm:p-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.4165 9.9986C17.4168 10.1909 17.3437 10.3832 17.197 10.53L12.2004 15.5301C11.9076 15.8231 11.4327 15.8233 11.1397 15.5305C10.8467 15.2377 10.8465 14.7629 11.1393 14.4699L14.8594 10.7472L3.33203 10.7472C2.91782 10.7472 2.58203 10.4114 2.58203 9.99715C2.58203 9.58294 2.91782 9.24715 3.33203 9.24715L14.854 9.24715L11.1393 5.53016C10.8465 5.23717 10.8467 4.7623 11.1397 4.4695C11.4327 4.1767 11.9075 4.17685 12.2003 4.46984L17.1578 9.43049C17.3163 9.568 17.4165 9.77087 17.4165 9.99715C17.4165 9.99763 17.4165 9.99812 17.4165 9.9986Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pl-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total {label}:
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {totalCount ?? 0}
          </span>
        </div>
      </div>
    </>
  );
}

export default UserPagination;
