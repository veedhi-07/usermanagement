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
import { PlusIcon, ChevronDown, X } from "lucide-react";
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
  const [unreadMsgCount, setUnreadMsgCount] = useState<Record<string, number>>(
    {},
  );
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
      seenBy: [currentUser.uid],
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

  //marks as read
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const markAsRead = async () => {
      const q = query(
        collection(db, "conversation", conversationId, "messages"),
      );

      const snapshot = await getDocs(q);

      const updates: Promise<void>[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();

        if (
          data.senderId !== currentUser.uid &&
          !data.seenBy?.includes(currentUser.uid)
        ) {
          updates.push(
            updateDoc(docSnap.ref, {
              seenBy: [currentUser.uid],
            }),
          );
        }
      });
      await Promise.all(updates);
    };
    markAsRead();
  }, [conversationId, currentUser]);

  //unread msg countt
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribes: (() => void)[] = [];

    directChats.forEach((chat) => {
      const q = query(collection(db, "conversation", chat.id, "messages"));

      const unsub = onSnapshot(q, (snapshot) => {
        let count = 0;
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (
            !data.seenBy?.includes(currentUser.uid) &&
            data.senderId !== currentUser.uid
          ) {
            count++;
          }
        });
        setUnreadMsgCount((prev) => ({
          ...prev,
          [chat.id]: count,
        }));
      });
      unsubscribes.push(unsub);
    });
    return () => unsubscribes.forEach((u) => u());
  }, [directChats, currentUser]);

  //for group
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribes: (() => void)[] = [];

    spaces.forEach((chat) => {
      const q = query(collection(db, "conversation", chat.id, "messages"));

      const unsub = onSnapshot(q, (snapshot) => {
        let count = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          if (
            data.senderId !== currentUser.uid &&
            !data.seenBy?.includes(currentUser.uid)
          ) {
            count++;
          }
        });
        setUnreadMsgCount((prev) => ({
          ...prev,
          [chat.id]: count,
        }));
      });
      unsubscribes.push(unsub);
    });
    return () => unsubscribes.forEach((u) => u());
  }, [spaces, currentUser]);

  //To display chats in sidebar
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

  // display chat under direct section
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
                <span className="pr-30">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </span>
                {unreadMsgCount[chat.id] > 0 && (
                  <span className="bg-red-500 text-xs py-1 px-2 rounded-full">
                    {unreadMsgCount[chat.id]}
                  </span>
                )}
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
              <span className=" pr-36">{space.name}</span>
              {unreadMsgCount[space.id] > 0 && (
                <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                  {unreadMsgCount[space.id]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col bg-blue-950">
        <div className=" p-4 flex items-center">
          {isGroupChat && groupChatName ? (
            <div className="flex flex-row">
              <span>
                <p className="font-bold text-white">{groupChatName}</p>
              </span>
              <span>
                <X
                  className="text-white cursor-pointer"
                  onClick={() => {
                    setConversationId(null);
                    setIsGroupChat(false);
                    setGroupChatName(null);
                    setSelectedUser(null);
                    setMessages([]);
                  }}
                  size={26}
                />
              </span>
            </div>
          ) : selectedUser ? (
            <div className="flex justify-between items-center w-full">
              <span>
                <p className="font-bold text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-white">{selectedUser.role}</p>
              </span>
              <span>
                <X
                  className="text-white cursor-pointer"
                  onClick={() => {
                    setConversationId(null);
                    setSelectedUser(null);
                    setIsGroupChat(false);
                    setMessages([]);
                  }}
                  size={26}
                />
              </span>
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
              className={`w-fit p-3 rounded-lg ${
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
