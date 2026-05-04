import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Pencil, Trash2 } from "../../assets/icons/index";
import { SearchIcon } from "lucide-react";
import { Plus } from "lucide-react";
import Badge from "../../components/ui/badge/index";
import { useUser } from "./hooks/useuser-hook";
import UserPagination from "../../components/common/pagination";
import { useState, useEffect } from "react";
import { User } from "./types";
import { useModal } from "../../hooks/use-modal";
import useDebounce from "../../hooks/use-debounce";
import { usePermission } from "../../hooks/use-permission";
import DeleteModal from "../../components/common/delete-modal/index";
import AddEditModal from "./components/addedit-modal";
import PageMeta from "../../components/common/page-meta";

export default function UserTable() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const addEditModal = useModal();
  const deleteModal = useModal();
  const { can } = usePermission();
  const debouncedSearch = useDebounce(search, 400);
  const { users, total, isLoading } = useUser({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil((total || 0) / limit);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <PageMeta title="Users Page" />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center justify-between p-3">
                <h3 className="text-base font-extrabold text-gray-800 dark:text-white/90">
                  Users List
                </h3>
                <div className="flex items-center gap-3 pl-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-amber-50"
                    />
                  </div>
                </div>
              </div>
              {can("users", "add") && (
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedId(null);
                    addEditModal.openModal();
                    // setIsEditOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition text-sm"
                >
                  <Plus size={16} />
                  Add User
                </button>
              )}
            </div>

            {/* <div className="max-w-full overflow-x-auto"> */}
            <div className="max-w-full overflow-x-auto max-h-[450px] overflow-y-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      User Details
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Role
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Email
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      isActive
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created At
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Updated At
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((user: User) => {
                    const isSuperAdmin =
                      user.roleTitle?.toLowerCase() === "super admin";

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {user.firstName} {user.lastName}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {user.username}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.roleTitle}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.phone}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={user.isActive ? "success" : "error"}
                          >
                            {user.isActive ? "Active" : "InActive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.updatedAt
                            ? new Date(user.updatedAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex gap-3">
                            {/* EDIT */}
                            {!isSuperAdmin && can("users", "edit") && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedId(user.id);
                                  addEditModal.openModal();
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Pencil size={18} />
                              </button>
                            )}
                            {/* DELETE */}
                            {!isSuperAdmin && can("users", "delete") && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setSelectedId(user.id);
                                  deleteModal.openModal();
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <DeleteModal
                isOpen={deleteModal.isOpen}
                id={selectedId}
                onClose={deleteModal.closeModal}
                type="user"
              />
              <AddEditModal
                isOpen={addEditModal.isOpen}
                onClose={addEditModal.closeModal}
                user={selectedUser}
              />
            </div>
          </div>
        </div>
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          limit={limit}
          setLimit={setLimit}
          totalCount={total}
          label="Users"
        />
      </div>
    </>
  );
}
