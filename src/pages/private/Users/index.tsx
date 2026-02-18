import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../components/firebase";

import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import { useAppSelector } from "../../../redux/hooks";
import { Pencil, Trash, ArrowUpDown,SearchIcon} from "lucide-react";
import { getAuth } from "firebase/auth";

import EditUserModal from "../../../../src/modals/EditModal";
import { Timestamp } from "firebase/firestore";

type User = {
id: string;
email: string;
firstName: string;
lastName: string;
role: string;
createdAt?: Timestamp;
};

const Users = () => {
const [users, setUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
const [searchQuery, setSearchQuery] = useState("");


useEffect(() => {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    const usersWithId = JSON.parse(storedUsers).map((u: any, idx: number) => ({
      id: `${idx}`, 
      ...u,
    }));
    setUsers(usersWithId);
  }
  setLoading(false);
}, []);



const profile = useAppSelector((state) => state.profile);
const isAdmin = profile?.role?.toLowerCase() === "admin";

const auth = getAuth();
const currentUser = auth.currentUser;


const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));

    const data: User[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));

    // const filteredUsers = currentUser
    //   ? data.filter((user) => user.id !== currentUser.uid)
    //   : data;

    // setUsers(filteredUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};


// useEffect(() => {
//   const auth = getAuth();

//   const unsubscribe = auth.onAuthStateChanged((user) => {
//     if (user) {
//       fetchUsers();
//     }
//   });

//   return () => unsubscribe();
// }, []);


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

if (loading) return <p className="p-6">Loading users...</p>;

const toggleSort = () => {
  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
};

// const sortedUsers = [...users].sort((a, b) => {
//   const nameA = a.firstName.toLowerCase();
//   const nameB = b.firstName.toLowerCase();

//   return sortOrder === "asc"
//     ? nameA.localeCompare(nameB)
//     : nameB.localeCompare(nameA);
// });

const filteredAndSortedUsers = users
  .filter((user) => {
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  })
  .sort((a, b) => {
    const nameA = (a?.firstname || "").toLowerCase();
    const nameB = (b?.firstname || "").toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

// const sortedUsers = [...users].sort((a, b) => {
//   const nameA = (a?.firstName || "").toLowerCase();
//   const nameB = (b?.firstName || "").toLowerCase();

//   return sortOrder === "asc"
//     ? nameA.localeCompare(nameB)
//     : nameB.localeCompare(nameA);
// });

const formatDate = (timestamp?: any) => {
  if (!timestamp) return "-";

  const date = timestamp.toDate(); 
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

return ( 
<div className="flex min-h-screen">
<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />


  <div className="flex-1 flex flex-col">
    <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

    <main className="flex-1 p-8 bg-gradient-to-br from-blue-100 to-blue-200">
      <h1 className="text-2xl font-bold mb-6">Users List</h1>

      <div className="relative w-full max-w-sm mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <SearchIcon size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>  

        <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
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
              {isAdmin && (
                <th className="p-3 text-left">Actions</th>
              )}
            </tr>
          </thead>

          {/* <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                {/* <td className="p-3">{user.firstName}</td>
                <td className="p-3">{user.lastName}</td> */}
                {/* <td className="p-3">{user.firstname || "-"}</td>
               <td className="p-3">{user.lastname || "-"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                {formatDate(user.createdAt)}
              </td>
                {isAdmin && (
                <td className="p-3 flex gap-3">
                  <Pencil
                    size={18}
                    className="cursor-pointer text-blue-500"
                    onClick={() => setSelectedUser(user)}
                  /> */}
{/* 
                  <Trash
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(user.id)}
                  />
                </td>
              )}
              </tr>
            ))}
          </tbody> */}

          <tbody>
  {filteredAndSortedUsers.length === 0 && (
    <tr>
      <td colSpan={isAdmin ? 6 : 5} className="p-6 text-center text-gray-500">
        No users found.
      </td>
    </tr>
  )}
  {filteredAndSortedUsers.map((user) => (
    <tr key={user.id} className="border-t hover:bg-gray-50">
      <td className="p-3">{user.firstname || "-"}</td>
      <td className="p-3">{user.lastname || "-"}</td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">{user.createdAt ? formatDate(user.createdAt) : "-"}</td>
      {isAdmin && (
        <td className="p-3 flex gap-3">
          <Pencil
            size={18}
            className="cursor-pointer text-blue-500"
            onClick={() => setSelectedUser(user)}
          />
          <Trash
            size={18}
            className="cursor-pointer text-red-500"
            onClick={() => handleDelete(user.id)}
          />
        </td>
      )}
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}
    </main>
  </div>
</div>


);
};

export default Users;
