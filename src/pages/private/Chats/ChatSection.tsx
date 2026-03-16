import { useState, useEffect } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PlusIcon, ChevronDown } from "lucide-react";
import AddToChatModal from "../../../modals/addtochat";
import { Timestamp } from "firebase/firestore";
import "react-simple-keyboard/build/css/index.css";
import Button from "../../../components/button";
import FormField from "../../../components/form-field/formfield";

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
  type: "private" | "group";
  createdAt: Timestamp;
  participants: string[];
  lastMessage?: string;
  senderId: string;
  receiverId: string;
  text: string;
  name?: string;
};

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  type: string;
  createdAt: Timestamp;
  seenBy: string[];
}
const ChatSection = ({ sidebarOpen }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupChatName, setGroupChatName] = useState<string | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [ShowAddToChatModal, setShowAddToChatModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [directChats, setDirectChats] = useState<conversation[]>([]);
  const [spaces, setSpaces] = useState<conversation[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
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
        createdBy: currentUser.uid,
      });
      return conversationRef.id;
    } catch (error) {
      console.log("Error Creating Conversation", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUser || !conversationId) return;

    const newMessage = {
      senderId: currentUser.uid,
      text: messageInput,
      type: isGroupChat ? "group" : "private",
      createdAt: Timestamp.now(),

      ...(selectedUser && { receiverId: selectedUser.id }),
    };

    try {
      await addDoc(
        collection(db, "conversation", conversationId, "messages"),
        newMessage,
      );

      const docRef = doc(db, "conversation", conversationId);
      await updateDoc(docRef, {
        lastMessage: messageInput,
        lastMessageAt: Timestamp.now(),
      });
      setMessageInput("");
    } catch (error) {
      console.log("Error Sending Message", error);
    }
  };

  // Used when new user is selected to clear the messages
  // useEffect(() => {
  //   setConversationId(conversationId);
  // }, [selectedUser]);

  //To load previous messages
  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, "conversation", conversationId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));

      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [conversationId]);

  // //marks as read
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const markAsRead = async () => {
      const q = query(
        collection(db, "conversation", conversationId, "messages"),
        where("receiverId", "==", currentUser.uid),
        where("read", "==", false),
      );

      const snapshot = await getDocs(q);

      for (const docSnap of snapshot.docs) {
        await updateDoc(docSnap.ref, {
          read: true,
        });
      }
    };
    markAsRead();
  }, [messages, conversationId, currentUser]);

  //For specifying private or groupchat to display
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "conversation"),
      where("participants", "array-contains", currentUser.uid),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats: conversation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<conversation, "id">),
      }));

      const direct = chats.filter((c) => c.type === "private");
      const groups = chats.filter((c) => c.type === "group");

      setDirectChats(direct);
      setSpaces(groups);
    });
    return () => unsubscribe();
  }, [currentUser]);

  //display chat under direct section
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const map: Record<string, User> = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        map[doc.id] = {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        };
      });

      setUserMap(map);
    };

    fetchUsers();
  }, []);

  // useEffect(() => {
  //   const fetchGroup = async () => {
  //     const snapshot = await getDocs(collection(db,"messages","type"));
  //     const map : Record<string,Message> = {};
  //     snapshot.docs.forEach((doc)=>{
  //       const data = doc.data();
  //     })
  //   }
  // })
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
        <div className="mt-3">
          {directChats.map((chat) => {
            if (!chat.participants) return null;

            const otherUserId = chat.participants.find(
              (id: string) => id !== currentUser?.uid,
            );

            const user = otherUserId ? userMap[otherUserId] : null;

            return (
              <div
                key={chat.id}
                className="p-2 text-white cursor-pointer hover:bg-gray-700 rounded"
                onClick={() => {
                  if (!user) return;

                  setConversationId(chat.id);
                  setSelectedUser(user);
                  setIsGroupChat(false);
                }}
              >
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </div>
            );
          })}
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
              <PlusIcon size={24} onClick={() => setShowAddToChatModal(true)} />
            </div>
          </span>
        </div>

        <div className="mt-3">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="p-2 text-white cursor-pointer hover:bg-gray-700 rounded"
              onClick={() => {
                setConversationId(space.id);
                setIsGroupChat(true);
                setGroupChatName(space.name || "Group");
              }}
            >
              {space.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-blue-950">
        <div className=" p-4 flex items-center">
          {isGroupChat && groupChatName ? (
            <div>
              <p className="font-bold text-white">{groupChatName}</p>
              <p className="text-sm text-white">Group Chat</p>
            </div>
          ) : selectedUser ? (
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {(selectedUser || isGroupChat) && messages.length == 0 && (
            <p className="text-center text-black">No messages yet</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg ${
                msg.senderId === currentUser?.uid
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        {(selectedUser || isGroupChat) && (
          <div className=" flex items-center gap-4 p-4 bg-gray-100 border-t">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="rounded-lg p-2 w-full"
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
          onUserSelect={async (users, chatName) => {
            // PRIVATE CHAT
            if (!Array.isArray(users)) {
              setIsGroupChat(false);
              setGroupChatName(null);
              setSelectedUser(users);

              const convoId = await createConversation(users.id);
              if (convoId) setConversationId(convoId);
            }

            // GROUP CHAT
            else {
              setIsGroupChat(true);
              setGroupChatName(chatName || "Unnamed Group");
              setSelectedUser(null);

              const conversationRef = await addDoc(
                collection(db, "conversation"),
                {
                  type: "group",
                  name: chatName,
                  participants: users.map((u) => u.id),
                  createdAt: Timestamp.now(),
                  createdBy: currentUser?.uid,
                },
              );
              setConversationId(conversationRef.id);
            }
            setShowAddToChatModal(false);
          }}
        />
      )}
    </div>
  );
};
export default ChatSection;
