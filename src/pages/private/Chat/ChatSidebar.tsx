import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Spinner } from "flowbite-react";
import { db } from "../../../components/firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import { PlusIcon, ChevronDown } from "lucide-react";
import AddToChatModal from "../../../modals/AddToChat";

export type Chat = {
  id: string;
  firstName: string;
  role: string;
};

const ChatSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Chat[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ShowAddToChatModal, setShowAddToChatModal] = useState(false);
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
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" aria-label="Loading users..." />
      </div>
    );

  return (
    <>
      <div className="flex flex-col">
        <div
          style={{ left: sidebarOpen ? "16rem" : "0" }}
          className="
    top-16
    h-[calc(100vh-4rem)]
    w-64
   bg-gray-900
    shadow-xl
    z-40
    ml-0.5
    flex flex-col
    rounded-t-2xl
    rounded-b-2xl
  "
        >
          {/* Title */}
          <div className="flex flex-row">
            <span>
              <div className="pt-4 cursor-pointer text-white">
                <ChevronDown size={20} />
              </div>
            </span>
            <span>
              <div className="pt-3 text-lg cursor-pointer text-white">
                Direct Messages
              </div>
            </span>
            <span>
              <div className="pt-3 pl-16 cursor-pointer text-white">
                <PlusIcon
                  size={24}
                  onClick={() => setShowAddToChatModal(true)}
                />
              </div>
            </span>
          </div>
          {/* Div For The Display Of Direct Messages */}
          {/* <div className="pl-6 text-sm">No Recent Chats</div> */}
          <div className="flex flex-row">
            <span>
              <div className="pt-4 cursor-pointer pt-49 text-white">
                <ChevronDown size={20} />
              </div>
            </span>
            <span>
              <div className="pt-3 text-lg cursor-pointer pt-48 text-white">
                Spaces
              </div>
            </span>
          </div>
          {/* Div For The Display Of Groups */}
          <div></div>
        </div>
      </div>
      {ShowAddToChatModal && (
        <AddToChatModal onClose={() => setShowAddToChatModal(false)} />
      )}
    </>
  );
};
export default ChatSidebar;
