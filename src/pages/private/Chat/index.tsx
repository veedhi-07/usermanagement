import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { getAuth } from "firebase/auth";
import { Spinner } from "flowbite-react";
import { db } from "../../../components/firebase";
import { collection, getDocs } from "firebase/firestore";

export type Chat = {
  id: string;
  firstName: string;
  role: string;
};

const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));

          const data: Chat[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Chat, "id">),
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

  const filteredAndSortedUsers = users
    .filter((user) => {
      const fullName = `${user.firstName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = (a.firstName || "").toLowerCase();
      const nameB = (b.firstName || "").toLowerCase();

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" aria-label="Loading users..." />
      </div>
    );

  return (
    <>
      <div
        style={{ left: sidebarOpen ? "16rem" : "0" }}
        className="
    fixed
    top-16
    h-[calc(100vh-4rem)]
    w-64
    bg-linear-to-br from-blue-300 to-blue-500
    shadow-xl
    z-40
    ml-0.5
    transition-all duration-300
    flex flex-col
    rounded-t-2xl
    rounded-b-2xl
  "
      >
        {/* Title */}
        <div className="p-6 text-lg font-bold border-b">Users</div>

        {/* Search */}
        <div className="relative px-3 py-2">
          <span className="absolute left-6 top-4 text-black">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            placeholder="Search Users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredAndSortedUsers.length === 0 ? (
            <p className="p-3 text-sm text-gray-700">No users found</p>
          ) : (
            <ol className="space-y-2">
              {filteredAndSortedUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`
              p-3 rounded-lg cursor-pointer transition-all
              ${
                selectedUserId === user.id
                  ? "bg-white shadow-md"
                  : "hover:bg-blue-200"
              }
            `}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-black">
                      {user.firstName || "-"}
                    </span>
                    <span className="text-sm text-gray-700 capitalize">
                      {user.role || "-"}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className={`flex-1 flex flex-col transition-all duration-300 `}>
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          {/* Overlay */}
        </div>
      </div>
    </>
  );
};
export default Chat;
