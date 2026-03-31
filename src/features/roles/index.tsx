import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import UserPagination from "../../components/pagination";
import usePagination from "../../hooks/use-pagination/index";
import {
  SearchIcon,
  Trash,
  PlusSquare,
  Pencil,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Can from "../../services/helper/can";
import { usePermission } from "../../hooks/use-permission/index";
import DeleteModal from "../../components/delete-modal";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadSpinner from "../../components/common/spinner";
import FormField from "../../components/common/form-field/formfield";
import type { Permissions, Roles } from "../../../src/types/index";
import { useMemo } from "react";
import {
  setRoleSearch,
  setRoleSort,
  setShowDeleteModal,
  setSidebarOpen,
} from "../../redux/reducer/ui-slice/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useRole, useDeleteRole } from "../../hooks/use-role";
const Roles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const sortOrder = useAppSelector((state) => state.ui.roles.sortOrder);
  const searchQuery = useAppSelector((state) => state.ui.roles.searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const showDeleteModal = useAppSelector(
    (state) => state.ui.roles.showDeleteModal,
  );
  const dispatch = useAppDispatch();
  const itemsPerPage = 7;
  const deleteRole = useDeleteRole();
  const { can } = usePermission();
  const canDelete = can("role", "delete");
  const canEdit = can("role", "edit");
  const { data: roles = [], isLoading: loading } = useRole();


  //toastmsg
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);

      // clear message so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  //Permission Count
  const countPermissions = (permissions: Permissions) => {
    let count = 0;

    Object.values(permissions).forEach((module) => {
      Object.values(module).forEach((value) => {
        if (value) count++;
      });
    });

    return count;
  };
  const handleDelete = useCallback(async () => {
    if (!selectedUserId) return;

    deleteRole.mutate(selectedUserId, {
      onSuccess: () => {
        dispatch(setShowDeleteModal(false));
        setSelectedUserId(null);
      },
    });
  }, [selectedUserId]);

  // search + sort

  const filteredAndSortedRoles = useMemo(() => {
    const query = (debouncedSearch || "").toLowerCase();
    return [...(roles || [])]

      .filter((role) => (role.role || "").toLowerCase().includes(query))
      .sort((a, b) => {
        const nameA = (a.role || "").toLowerCase();
        const nameB = (b.role || "").toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  }, [roles, debouncedSearch, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const {
    paginatedData: paginatedRoles,
    totalPages,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(filteredAndSortedRoles, itemsPerPage);

  const mapPermissions = (
    apiPermissions?: Roles["permissions"],
  ): Permissions => {
    return {
      user: {
        view: !!apiPermissions?.users?.view,
        add: !!apiPermissions?.users?.add,
        edit: !!apiPermissions?.users?.edit,
        delete: !!apiPermissions?.users?.delete,
      },
      role: {
        view: !!apiPermissions?.roles?.view,
        add: !!apiPermissions?.roles?.add,
        edit: !!apiPermissions?.roles?.edit,
        delete: !!apiPermissions?.roles?.delete,
      },
      chat: {
        view: !!apiPermissions?.chat?.view,
        add: !!apiPermissions?.chat?.add,
        edit: !!apiPermissions?.chat?.edit,
        delete: !!apiPermissions?.chat?.delete,
      },
      campaign: {
        view: !!apiPermissions?.campaign?.view,
        add: !!apiPermissions?.campaign?.add,
        edit: !!apiPermissions?.campaign?.edit,
        delete: !!apiPermissions?.campaign?.delete,
      },
    };
  };
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => dispatch(setSidebarOpen(false))}
        />

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => dispatch(setSidebarOpen(!sidebarOpen))} />

          <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
            {loading ? (
              <LoadSpinner />
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6">Roles List</h1>

                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-full max-w-sm bg-white rounded-lg">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                      <SearchIcon size={18} />
                    </span>
                    <FormField
                      type="text"
                      id=""
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => {
                        dispatch(setRoleSearch(e.target.value));
                      }}
                      className=" pl-10 pr-4 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Can module="role" action="add">
                      <span className="text-black font-bold">Add Roles</span>
                      <PlusSquare
                        className="cursor-pointer"
                        size={28}
                        onClick={() => navigate("/add-role")}
                      />
                    </Can>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="p-3 text-left">
                          <div className="flex items-center gap-2">
                            <ArrowUpDown
                              size={18}
                              onClick={() => {
                                dispatch(
                                  setRoleSort(
                                    sortOrder === "asc" ? "desc" : "asc",
                                  ),
                                );
                              }}
                              className="cursor-pointer hover:text-blue-600"
                            />
                            <span>Role Name</span>
                          </div>
                        </th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Role Permission</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedRoles.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="  p-6 text-center text-gray-500"
                          >
                            No roles found.
                          </td>
                        </tr>
                      )}

                      {paginatedRoles.map((role) => (
                        <tr key={role.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{role.role}</td>
                          <td className="p-3">
                            {role.createdAt ? formatDate(role.createdAt) : "-"}
                          </td>

                          <td className="p-3">
                            {countPermissions(mapPermissions(role.permissions))}
                          </td>
                          <td className="p-3 flex gap-3">
                            <Pencil
                              size={20}
                              className={`cursor-pointer text-blue-500 ${canEdit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                              onClick={
                                canEdit
                                  ? () => navigate(`/edit-role/${role.id}`)
                                  : undefined
                              }
                            />
                            <Trash
                              size={18}
                              className={`cursor-pointer text-red-500 ${canDelete ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                              onClick={() => {
                                setSelectedUserId(role.id);
                                dispatch(setShowDeleteModal(true));
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <UserPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                  nextPage={nextPage}
                  prevPage={prevPage}
                />
                {showDeleteModal && (
                  <DeleteModal
                    show={showDeleteModal}
                    onClose={() => dispatch(setShowDeleteModal(false))}
                    onConfirm={handleDelete}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Roles;
