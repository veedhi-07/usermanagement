import { useState, useEffect } from "react";
import { db } from "../../../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Spinner } from "flowbite-react";
import { PlusIcon } from "lucide-react";
import AddToChatModal from "../../../modals/AddToChat";

type Props = {
  sidebarOpen: boolean;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
};

const ChatSection = ({ sidebarOpen }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const data: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));

      setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div
      className="flex h-[calc(100vh-64px)] transition-all duration-300"
      style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
    >
      {/* USERS SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <span className="font-semibold">Direct Messages</span>

          <PlusIcon
            className="cursor-pointer"
            onClick={() => setShowAddModal(true)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 cursor-pointer hover:bg-gray-800 ${
                selectedUser?.id === user.id ? "bg-gray-800" : ""
              }`}
            >
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex flex-1 flex-col bg-white">
        {/* CHAT HEADER */}
        <div className="border-b p-4 flex items-center">
          {selectedUser ? (
            <div>
              <p className="font-bold">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>

              <p className="text-sm text-gray-500">{selectedUser.role}</p>
            </div>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 && selectedUser && (
            <p className="text-center text-gray-400">No messages yet</p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId === selectedUser?.id
                  ? "bg-gray-200"
                  : "bg-blue-500 text-white ml-auto"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* MESSAGE INPUT */}
        {selectedUser && (
          <div className="border-t p-4 flex gap-3">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Type message..."
            />

            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToChatModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default ChatSection;
