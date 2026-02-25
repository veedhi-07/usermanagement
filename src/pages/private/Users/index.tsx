import  { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../components/firebase";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import {
  Pencil,
  Trash,
  ArrowUpDown,
  SearchIcon,
  PlusSquare,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import EditUserModal from "../../../../src/modals/EditModal";
import UserPagination from "../../../components/Pagination/userPagination";
import AddUserModal from "../../../modals/AddUser";
import Can from "../../../components/Can";
import { usePermission } from "../../../hooks/usePermission";
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: Timestamp;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { can } = usePermission(); 
  const canDelete = can("user", "delete");
  const canEdit = can("user","edit")

  const itemsPerPage = 7;

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));

          const data: User[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<User, "id">),
          }));

          const filteredUsers = data.filter((u) => u.id !== user.uid);

          setUsers(filteredUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  
//DeleteUser
  const handleDelete = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (values: Omit<User, "id">) => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, values);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...values } : u
        )
      );

      setSelectedUser(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  //  Add User
  const handleAddUser = async (values: Omit<User, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...values,
        createdAt: Timestamp.now(),
      });

      const newUser: User = {
        id: docRef.id,
        ...values,
        createdAt: Timestamp.now(),
      };

      setUsers((prev) => [...prev, newUser]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Add user failed:", error);
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return "-";

    const date = timestamp.toDate();
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
          <h1 className="text-2xl font-bold mb-6">Users List</h1>

          <div className="flex justify-between items-center mb-4">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <SearchIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                 setShowAddModal(true);
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
                        onClick={toggleSort}
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
                      className="p-6 text-center text-gray-500"
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
                      {user.createdAt
                        ? formatDate(user.createdAt)
                        : "-"}
                    </td>
                      <td className="p-3 flex gap-3">
                        <Pencil
                          size={18}
                          className={`cursor-pointer text-blue-500 ${canEdit ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                          onClick={canEdit ?() => setSelectedUser(user): undefined}
                        />
                        <Trash
                          size={18}
                          className={`cursor-pointer text-red-500 ${canDelete ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
                           onClick={canDelete ?() => handleDelete(user.id) : undefined}
                        />
                       
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <UserPagination
            data={filteredAndSortedUsers}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

          {selectedUser && (
            <EditUserModal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onSave={handleSave}
            />
          )}

          {showAddModal && (
            <AddUserModal
              onClose={() => setShowAddModal(false)}
              onSave={handleAddUser}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;
