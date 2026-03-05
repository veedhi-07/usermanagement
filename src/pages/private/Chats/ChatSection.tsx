import { useState, useEffect } from "react";
import { db } from "../../../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Spinner } from "flowbite-react";
import { PlusIcon, ChevronDown } from "lucide-react";
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
  receiverId: string;
  createdAt: any;
};

const ChatSection = ({ sidebarOpen }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ShowAddToChatModal, setShowAddToChatModal] = useState(false);
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
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div
      className="flex h-[calc(100vh-64px)] transition-all duration-300 bg-gray-900 rounded-md mt-1"
      style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
    >
      <div className="w-64">
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
            <div className="pt-3 ml-16 cursor-pointer text-white">
              <PlusIcon size={24} onClick={() => setShowAddToChatModal(true)} />
            </div>
          </span>
        </div>
        <div className="flex flex-row">
          <span>
            <div className="  pt-49 cursor-pointer text-white">
              <ChevronDown size={20} />
            </div>
          </span>
          <span>
            <div className="  pt-48 text-lg cursor-pointer text-white">
              Spaces
            </div>
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-blue-950">
        <div className=" p-4 flex items-center">
          {selectedUser ? (
            <div>
              <p className="font-bold text-white">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p className="text-sm text-white">{selectedUser.role}</p>
            </div>
          ) : (
            <p className="text-white">Select a user to start conversation.</p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-7 bg-gray-50">
          {selectedUser && messages.length && (
            <p className="text-center text-gray-500">No messages yet</p>
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

        {ShowAddToChatModal && (
          <AddToChatModal onClose={() => setShowAddToChatModal(false)} />
        )}
      </div>
    </div>
  );
};
export default ChatSection;
