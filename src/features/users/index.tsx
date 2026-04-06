import { useState, useCallback } from "react";
import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import {
  Pencil,
  Trash,
  ArrowUpDown,
  SearchIcon,
  PlusSquare,
} from "lucide-react";
import CommonModal from "../../components/addedit-modal";
import UserPagination from "../../components/pagination";
import usePagination from "../../hooks/use-pagination";
import DeleteModal from "../../components/delete-modal";
import LoadSpinner from "../../components/common/spinner";
import Can from "../../services/helper/can";
import { usePermission } from "../../hooks/use-permission";
import { ToastContainer } from "react-toastify";
import FormField from "../../components/common/form-field/formfield";
import "react-toastify/dist/ReactToastify.css";
import type { User } from "../../../src/types/index";
import {
  useUser,
  useDeleteUser,
  useCreateUser,
  useUpdateUser,
} from "../../hooks/use-user";
import { useRole } from "../../hooks/use-role";
import {
  setUserSearch,
  setUserSort,
  setSelectedUser,
  setShowModals,
  setSidebarOpen,
} from "../../redux/reducer/ui-slice/index";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useRef, useEffect } from "react";
import userworker from "../../wokers/userworker?worker";
const Users = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { can } = usePermission();
  const canDelete = can("user", "delete");
  const canEdit = can("user", "edit");
  const [processedUsers, setProcessedUsers] = useState<User[]>([]);
  const sortOrder = useAppSelector((state) => state.ui.users.sortOrder);
  const searchQuery = useAppSelector((state) => state.ui.users.searchQuery);
  const selectedUser = useAppSelector((state) => state.ui.users.selectedUser);
  const showModals = useAppSelector((state) => state.ui.users.showModals);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const workerRef = useRef<Worker | null>(null);
  const itemsPerPage = 7;
  // const getRoleName = (roleId: string) => {
  //   return roles.find((r) => r.id === roleId)?.role || "Unknown";
  // };
  const getRoleName = (roleId: string) => {
    return (
      roles.find((r) => String(r.id) === String(roleId))?.role || "Unknown"
    );
  };

  const { data: users = [], isLoading } = useUser();
  const { data: roles = [] } = useRole();

  const updateUser = useUpdateUser();

  const handleSave = useCallback((updatedUser: User) => {
    updateUser.mutate({
      id: updatedUser.id,
      data: updatedUser,
    });

    dispatch(setSelectedUser(null));
  }, []);

  const deleteUser = useDeleteUser();

  const handleDelete = useCallback(() => {
    if (!selectedUserId) return;

    deleteUser.mutate(selectedUserId, {
      onSuccess: () => {
        dispatch(setShowModals({ add: false, delete: false }));
        setSelectedUserId(null);
      },
    });
  }, [selectedUserId]);

  const createUser = useCreateUser();

  // const filteredAndSortedUsers = useMemo(() => {
  //   return [...users]

  //     .filter((user) => {
  //       const fullName =
  //         `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
  //       return fullName.includes(searchQuery.toLowerCase());
  //     })
  //     .sort((a, b) => {
  //       const nameA = (a.firstName || "").toLowerCase();
  //       const nameB = (b.firstName || "").toLowerCase();

  //       return sortOrder === "asc"
  //         ? nameA.localeCompare(nameB)
  //         : nameB.localeCompare(nameA);
  //     });
  // }, [users, searchQuery, sortOrder]);

  useEffect(() => {
    workerRef.current = new userworker();
    workerRef.current.onmessage = (e) => {
      setProcessedUsers(e.data);
    };
  }, []);

  useEffect(() => {
    workerRef.current?.postMessage({
      users,
      searchQuery,
      sortOrder,
    });
  }, [users, searchQuery, sortOrder]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const {
    paginatedData: paginatedUsers,
    totalPages,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(processedUsers, itemsPerPage);
  if (isLoading) return <LoadSpinner />;
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => dispatch(setSidebarOpen(false))}
        />

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => dispatch(setSidebarOpen(!sidebarOpen))} />

          <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
            <h1 className="text-2xl font-bold mb-6">Users List</h1>

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
                    dispatch(setUserSearch(e.target.value));
                  }}
                  className=" pl-10 pr-4 py-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none outline-none"
                />
              </div>

              <Can module="user" action="add">
                <div className="flex items-center gap-2">
                  <span className="text-black font-bold">Add User</span>
                  <PlusSquare
                    size={28}
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(setShowModals({ add: true, delete: false }));
                    }}
                  />
                </div>
              </Can>
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
                              setUserSort(sortOrder === "asc" ? "desc" : "asc"),
                            );
                          }}
                          className="cursor-pointer hover:text-blue-600"
                        />
                        <span>First Name</span>
                      </div>
                    </th>
                    <th className="p-3 text-left">Last Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6  text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                  {paginatedUsers.map((user) => {
                    return (
                      <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{user.firstName || "-"}</td>
                        <td className="p-3">{user.lastName || "-"}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.role || "Unknown"}</td>
                        <td className="p-3">
                          {user.createdAt ? formatDate(user.createdAt) : "-"}
                        </td>
                        <td className="p-3 flex gap-3">
                          <Pencil
                            size={18}
                            className={`cursor-pointer text-blue-500 ${canEdit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                            onClick={
                              canEdit
                                ? () => dispatch(setSelectedUser(user))
                                : undefined
                            }
                          />
                          <Trash
                            size={18}
                            className={`cursor-pointer text-red-500 ${canDelete ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                            onClick={() => {
                              setSelectedUserId(user.id);
                              dispatch(
                                setShowModals({ add: false, delete: true }),
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
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

            {/* Add User */}

            {showModals.add && (
              <CommonModal
                isOpen={true}
                onClose={() =>
                  dispatch(setShowModals({ add: false, delete: false }))
                }
                mode="add"
                onSave={(newUser) => createUser.mutate(newUser)}
              />
            )}

            {selectedUser && (
              <CommonModal
                isOpen={selectedUser !== null}
                onClose={() => dispatch(setSelectedUser(null))}
                mode="edit"
                user={selectedUser}
                onSave={handleSave}
              />
            )}
            {showModals.delete && (
              <DeleteModal
                show={true}
                onClose={() =>
                  dispatch(setShowModals({ add: false, delete: false }))
                }
                onConfirm={handleDelete}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Users;
