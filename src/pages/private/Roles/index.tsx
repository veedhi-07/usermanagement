import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../components/firebase";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import UserPagination from "../../../components/Pagination/userPagination";
import { useAppSelector } from "../../../redux/hooks";
import { SearchIcon, Trash, PlusSquare, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = {
  id: string;
  name: string;
  permissions: Permissions;
  createdAt?: Timestamp;
};

const Roles = () => {
const navigate = useNavigate(); 

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;
  const countPermissions = (permissions: Permissions) => {
    let count = 0;

    Object.values(permissions).forEach((module) => {
      Object.values(module).forEach((value) => {
        if (value) count++;
      });
    });

  return count;
};
  const profile = useAppSelector((state) => state.profile);
  const isAdmin = profile?.role?.toLowerCase() === "admin";

  // Fetch Roles
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const snapshot = await getDocs(collection(db, "roles"));
      const data: Role[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Role, "id">),
      }));

      setRoles(data); 
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Role
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "roles", id));
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // search + sort
  const filteredAndSortedRoles = roles
    .filter((role) =>
      role.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredAndSortedRoles.slice(startIndex, endIndex);

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return "-";
    return timestamp.toDate().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <p className="p-6">Loading roles...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
          <h1 className="text-2xl font-bold mb-6">Roles List</h1>

          {/* Search + Add */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <SearchIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="Search Roles"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-black font-bold">Add Roles</span>
              <PlusSquare
                size={28}
                className={`${
                  !isAdmin
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => isAdmin && navigate("/add-role")}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-300">
                <tr>
                  <th
                    className="p-3 text-left cursor-pointer"
                    onClick={toggleSort}
                  >
                    Role Name
                  </th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Role Permission</th>
                  {isAdmin && <th className="p-3 text-left">Actions</th>}
                </tr>
              </thead>

              <tbody>
                {paginatedRoles.length === 0 && (
                  <tr>
                    <td
                      colSpan={isAdmin ? 3 : 2}
                      className="p-6 text-center text-gray-500"
                    >
                      No roles found.
                    </td>
                  </tr>
                )}

                {paginatedRoles.map((role) => (
                  <tr key={role.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{role.name}</td>
                    <td className="p-3">
                      {role.createdAt
                        ? formatDate(role.createdAt)
                        : "-"}
                    </td>
                    <td className="p-3">{role.permissions ? countPermissions(role.permissions) : 0}</td>
                    {isAdmin && (
                      <td className="p-3 flex gap-3">
                        <Pencil
                          size={20}
                          className="cursor-pointer text-blue-500"
                          onClick={() => navigate(`/edit-role/${role.id}`)}
                        />
                        <Trash
                          size={20}
                          className="cursor-pointer text-red-500"
                          onClick={() => handleDelete(role.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <UserPagination
            data={filteredAndSortedRoles}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Roles;