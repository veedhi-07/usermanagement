import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Pencil, Trash2 } from "../../assets/icons";
import Badge from "../../components/ui/badge";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import { SearchIcon } from "lucide-react";
import { useRole } from "./hooks/userole-hook";
import { usePermission } from "../../hooks/use-permission";
import UserPagination from "../../components/common/pagination";
import { useState, useEffect } from "react";
import useDebounce from "../../hooks/use-debounce";
import PageMeta from "../../components/common/page-meta";
import { Role } from "./types";
import DeleteModal from "../../components/common/delete-modal";
import { getroleByIdApi } from "./services/role-service";
import RoleModal from "./components/modal";

export default function RoleTable() {
  // console.log("roles:", roles);
  const [selectedrole, setSelectedrole] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { can } = usePermission();
  const [limit, setLimit] = useState(5);
  const debouncedSearch = useDebounce(search, 400);
  const { roles, isLoading, total } = useRole({
    page: currentPage,
    limit,
    search: debouncedSearch,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);
  const handleEdit = useCallback(async (id: number) => {
    try {
      const res = await getroleByIdApi(id);
      setSelectedrole(res);
      setIsRoleModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleDelete = useCallback((role: Role) => {
    setSelectedrole(role);
    setSelectedId(role.id);
    setIsDeleteOpen(true);
  }, []);
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
      <PageMeta title="Roles Page" />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center justify-between p-3">
                <h3 className="text-base font-extrabold text-gray-800 dark:text-white/90">
                  Roles List
                </h3>
                <div className="flex items-center gap-3 pl-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 border rounded-lg text-sm dark:bg-gray-900 dark:border-gray-700"
                    />
                  </div>
                </div>
              </div>
              {can("role", "add") && (
                <button
                  onClick={() => {
                    setSelectedrole(null);
                    setSelectedId(null);
                    setIsRoleModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition text-sm"
                >
                  <Plus size={16} />
                  Add Role
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
                      Role Id
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Role Title
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      createdAt
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
                  {roles?.map((role: Role) => (
                    <TableRow key={role.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {role.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {role.title}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={role.status === "active" ? "success" : "error"}
                        >
                          {role.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {role.createdAt
                          ? new Date(role.createdAt).toLocaleString()
                          : "-"}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {role.updatedAt
                          ? new Date(role.updatedAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-3">
                          {/* EDIT */}
                          {can("role", "edit") && (
                            <button
                              onClick={() => handleEdit(role.id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {/* DELETE */}
                          {can("role", "delete") && (
                            <button
                              onClick={() => handleDelete(role)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DeleteModal
                isOpen={isDeleteOpen}
                id={selectedId}
                onClose={() => setIsDeleteOpen(false)}
                type="role"
              />
              <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => {
                  setIsRoleModalOpen(false);
                  setSelectedrole(null);
                }}
                role={selectedrole}
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
          label="Roles"
        />
      </div>
    </>
  );
}
