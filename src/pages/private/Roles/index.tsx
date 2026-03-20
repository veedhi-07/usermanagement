import { useEffect, useState } from "react";
import {
  // collection,
  // getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import UserPagination from "../../../components/pagination";
import { SearchIcon, Trash, PlusSquare, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Can from "../../../components/Can";
import { usePermission } from "../../../hooks/use-permission/usePermission";
import DeleteModal from "../../../components/deletemodal";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadSpinner from "../../../components/spinner";
import { useaddedituser } from "../../../hooks/use-addedituser/useaddedituser";
import FormField from "../../../components/form-field/formfield";
import type { User, Role, ProfileData } from "../../../../src/types/index";

const Roles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [roles, setRoles] = useState<Role[]>([]);
  // const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const itemsPerPage = 7;

  const { can } = usePermission();
  const canDelete = can("role", "delete");
  const canEdit = can("role", "edit");
  //toastmsg
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);

      // clear message so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  //Permission Count Function
  const countPermissions = (permissions: Permissions) => {
    let count = 0;

    Object.values(permissions).forEach((module) => {
      Object.values(module).forEach((value) => {
        if (value) count++;
      });
    });

    return count;
  };

  // // Fetch Roles
  // useEffect(() => {
  //   fetchRoles();
  // }, []);

  // const fetchRoles = async () => {
  //   try {
  //     const snapshot = await getDocs(collection(db, "roles"));
  //     const data: Role[] = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...(doc.data() as Omit<Role, "id">),
  //     }));

  //     setRoles(data);
  //   } catch (error) {
  //     console.error("Error fetching roles:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const { data: roles, loading } = useaddedituser<Role>("roles");
  // DeleteRole
  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      await deleteDoc(doc(db, "roles", selectedUserId));
      toast.success("Role Deleted");
      setShowDeleteModal(false);
      setSelectedUserId(null);
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
      role.name?.toLowerCase().includes(searchQuery.toLowerCase()),
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

  if (loading) return <LoadSpinner />;
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
            <h1 className="text-2xl font-bold mb-6">Roles List</h1>

            {/* Search + Add */}
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
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
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
                      <td className="p-3">{role.name}</td>
                      <td className="p-3">
                        {role.createdAt ? formatDate(role.createdAt) : "-"}
                      </td>
                      <td className="p-3">
                        {role.permissions
                          ? countPermissions(role.permissions)
                          : 0}
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
                            setShowDeleteModal(true);
                          }}
                        />
                      </td>
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
            {showDeleteModal && (
              <DeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Roles;
