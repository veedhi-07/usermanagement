import { useState, useEffect } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  doc,
  query,
  addDoc,
  updateDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PlusIcon, ChevronDown } from "lucide-react";
import AddToChatModal from "../../../modals/addtochat";
import CreateGroupModal from "../../../modals/creategroupmodal";
import { Timestamp } from "firebase/firestore";
import "react-simple-keyboard/build/css/index.css";
import Button from "../../../components/button";

type Props = {
  sidebarOpen: boolean;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type conversation = {
  id: string;
  type: string;
  createdAt: Timestamp;
  participant: string;
  lastMessage: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
};

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  type: string;
  createdAt: Timestamp;
}
const ChatSection = ({ sidebarOpen }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ShowAddToChatModal, setShowAddToChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const createConversation = async (userId: string) => {
    if (!currentUser) return;

    try {
      const conversationRef = await addDoc(collection(db, "conversation"), {
        type: "private",
        participants: [currentUser.uid, userId],
        lastMessage: messageInput,
        createdAt: Timestamp.now(),
        createdBy: userId,
      });
      return conversationRef.id;
    } catch (error) {
      console.log("Error Creating Conversation", error);
    }
  };
  const handleSendMessage = async () => {
    if (
      !messageInput.trim() ||
      !selectedUser ||
      !currentUser ||
      !conversationId
    )
      return;

    const newMessage = {
      receiverId: selectedUser.id,
      senderId: currentUser.uid,
      text: messageInput,
      type: "private",
      createdAt: Timestamp.now(),
    };

    try {
      const msgRef = await addDoc(
        collection(db, "conversation", conversationId, "messages"),
        newMessage,
      );

      const docRef = doc(db, "conversation", conversationId);
      await updateDoc(docRef, {
        lastMessage: messageInput,
        lastMessageAt: Timestamp.now(),
      });
      setMessages((prev) => [
        ...prev,
        {
          id: msgRef.id,
          ...newMessage,
        },
      ]);
      setMessageInput("");
    } catch (error) {
      console.log("Error Sending Message", error);
    }
  };
  // Used when new user is selected to clear the messages
  useEffect(() => {
    // setMessages([]);
    setConversationId(conversationId);
  }, [selectedUser]);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, "conversation", conversationId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<conversation, "id">),
      }));

      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [conversationId]);

  //       const snapshot = onSnapshot((q,snapshot)=> {
  //             const querySnapshot = getDocs(collection(db, "chat"));
  //             const messages: conversation[] = querySnapshot.docs.map((doc) => ({
  //               id: doc.id,
  //               ...(doc.messages() as any),
  //             }));
  //             setMessages(messages);
  //         })
  // --------------------------------------------------------------
  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Spinner size="xl" />
  //     </div>
  //   );
  // onchange = (Input) => {
  //   console.log("Input changed", Input);
  // };

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
          <span>
            <div className="pt-48 ml-34 cursor-pointer text-white">
              <PlusIcon
                size={24}
                onClick={() => setShowCreateGroupModal(true)}
              />
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 border-4">
          {selectedUser && messages.length == 0 && (
            <p className="text-center text-black">No messages yet</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId === currentUser?.uid
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="flex items-center gap-4 p-4 bg-gray-100 border-t">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1  border-2 rounded-lg p-2"
              placeholder="Type a message"
              type="text"
            />
            <Button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
              type="submit"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        )}
      </div>

      {ShowAddToChatModal && (
        <AddToChatModal
          onClose={() => setShowAddToChatModal(false)}
          onUserSelect={async (user) => {
            setSelectedUser(user);
            const convoId = await createConversation(user.id);

            if (convoId) {
              setConversationId(convoId);
            }
            setShowAddToChatModal(false);
          }}
        />
      )}
      {showCreateGroupModal && (
        <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
      )}
    </div>
  );
};
export default ChatSection;
