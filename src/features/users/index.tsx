import { useEffect, useState, useMemo } from "react";
import { Timestamp } from "firebase/firestore";
import { db } from "../../../services/firebase";
import Sidebar from "../../../components/layout/sidebar";
import Navbar from "../../../components/layout/navbar";
import {
  Pencil,
  Trash,
  ArrowUpDown,
  SearchIcon,
  PlusSquare,
} from "lucide-react";
import CommonModal from "../../../components/addeditmodal";
import { getAuth } from "firebase/auth";
import UserPagination from "../../../components/pagination";
import usePagination from "../../../hooks/use-pagination/usepagination";
import DeleteModal from "../../../components/deletemodal";
import LoadSpinner from "../../../components/common/spinner";
import Can from "../../../components/Can";
import { usePermission } from "../../../hooks/use-permission/usePermission";
import { ToastContainer } from "react-toastify";
import FormField from "../../../components/common/form-field/formfield";
import "react-toastify/dist/ReactToastify.css";
import type { User } from "../../../../src/types/index";
import { usersService } from "../../../services/firebase/usersService";
import {
  setUserSearch,
  setLoading,
  setUserSort,
  setSelectedUser,
  setShowModals,
  setSidebarOpen,
} from "../../../redux/reducer/uiSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { can } = usePermission();
  const canDelete = can("user", "delete");
  const canEdit = can("user", "edit");
  const sortOrder = useAppSelector((state) => state.ui.users.sortOrder);
  const searchQuery = useAppSelector((state) => state.ui.users.searchQuery);
  const selectedUser = useAppSelector((state) => state.ui.users.selectedUser);
  const showModals = useAppSelector((state) => state.ui.users.showModals);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const loading = useAppSelector((state) => state.ui.loading);
  const dispatch = useAppDispatch();
  const itemsPerPage = 7;

  useEffect(() => {
    dispatch(setLoading(true));

    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // const querySnapshot = await getDocs(collection(db, "users"));

          // const data: User[] = querySnapshot.docs.map((doc) => ({
          //   id: doc.id,
          //   ...(doc.data() as Omit<User, "id">),
          // }));
          const data = await usersService.getAll();
          const filteredUsers = data.filter((u) => u.id !== user.uid);

          setUsers(filteredUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  //DeleteUser
  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      // await deleteDoc(doc(db, "users", selectedUserId));
      await usersService.delete(selectedUserId);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
      dispatch(setShowModals({ add: false, delete: false }));
      setSelectedUserId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  //Save
  const handleSave = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );

    dispatch(setSelectedUser(null));
  };

  // const  sortOrder  = () => {
  //   setUserSort((prev) => (prev === "asc" ? "desc" : "asc"));
  // };

  const filteredAndSortedUsers = useMemo(() => {
    return [...users]

      .filter((user) => {
        const fullName =
          `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        const nameA = (a.firstName || "").toLowerCase();
        const nameB = (b.firstName || "").toLowerCase();

        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  }, [users, searchQuery, sortOrder]);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return "-";

    const date = timestamp.toDate();
    return date.toLocaleDateString("en-IN", {
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
  } = usePagination(filteredAndSortedUsers, itemsPerPage);
  if (loading) return <LoadSpinner />;
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
              {/* Search */}
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

              {/* Add User */}
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

            {/* Table */}
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

                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{user.firstName || "-"}</td>
                      <td className="p-3">{user.lastName || "-"}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
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

            {/* Add User */}

            {showModals.add && (
              <CommonModal
                isOpen={true}
                onClose={() =>
                  dispatch(setShowModals({ add: false, delete: false }))
                }
                mode="add"
                onSave={(newUser) => setUsers((prev) => [...prev, newUser])}
              />
            )}

            {/* Edit User */}
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
