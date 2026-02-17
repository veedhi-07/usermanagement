import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../components/firebase";

import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import { useAppSelector } from "../../../redux/hooks";
import { Pencil, Trash } from "lucide-react";
import {deleteDoc, doc} from 'firebase/firestore'

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};


const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleEdit = (userId: string) => {
  console.log("Edit user:", userId);
};

const handleDelete = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    setUsers((prev) => prev.filter(u => u.id !== userId));
  } catch (error) {
    console.error(error);
  }
};

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const data: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
const profile = useAppSelector((state) => state.profile);
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200">
          <h1 className="text-2xl font-bold mb-6">Users List</h1>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">First Name</th>
                    <th className="p-3 text-left">Last Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{user.firstName}</td>
                      <td className="p-3">{user.lastName}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                   <td className="p-3 flex gap-3">
                    <Pencil
                    size={18}
                    className="cursor-pointer text-blue-500"
                    onClick={() => handleEdit(user.id)}
                    />

                    <Trash
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(user.id)}
                    />
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;
