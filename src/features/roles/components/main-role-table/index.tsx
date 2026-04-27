import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Pencil, Trash2 } from "../../../../assets/icons/index";
import Badge from "../../../../components/ui/badge/index";
import { Plus } from "lucide-react";
import { useRole } from "../../../roles/hooks/userole-hook";
import { useState } from "react";
import DeleteModal from "../../../../components/common/delete-modal/index";
import { getroleByIdApi } from "../../services/role-service";
import RoleModal from "../../../../components/common/role-modal";

export default function RoleTable() {
  const { roles, isLoading } = useRole();
  console.log("roles:", roles);
  const [selectedrole, setSelectedrole] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-base font-extrabold text-gray-800 dark:text-white/90">
          Roles List
        </h3>

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
      </div>
      <div className="max-w-full overflow-x-auto">
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
            {roles?.map((role) => (
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
                    <button
                      onClick={async () => {
                        try {
                          const res = await getroleByIdApi(role.id);
                          console.log("API RES:", res);
                          setSelectedrole(res); 
                          setIsRoleModalOpen(true);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        setSelectedrole(role);
                        setSelectedId(role.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
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
  );
}
