import { useState, useEffect, useRef } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  // onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { X, UserPlus } from "lucide-react";
import ChatSidebar from "../chatsidebar";
import DirectChatModal from "../../../modals/directchat-modal";
import SpaceModal from "../../../modals/space-modal";
import { Timestamp } from "firebase/firestore";
import "react-simple-keyboard/build/css/index.css";
import Button from "../../../components/common/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import LoadSpinner from "../../../components/common/spinner";
import { usersService } from "../../../services/firebase/users-service/index";
import { chatsService } from "../../../services/firebase/chat-service/index";
import type { User, conversation, Message } from "../../../types/index";
import { toast } from "react-toastify";
import NoConversation from "../noconversation";
import {
  setSpaceName,
  setIsGroupChat,
  setShowDirectChatModal,
  setLoadingChats,
  setLoadingUsers,
  setShowSpaceModal,
  setConversationId,
} from "../../../redux/reducer/ui-slice/index";
import { getSocket } from "../../../socket";

type Props = {
  sidebarOpen: boolean;
};
const ChatSection = ({ sidebarOpen }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState<Record<string, number>>(
    {},
  );
  const [messageInput, setMessageInput] = useState("");
  const [directChats, setDirectChats] = useState<conversation[]>([]);
  const [spaces, setSpaces] = useState<conversation[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const spaceName = useAppSelector(
    (state) => state.ui.chats?.spaceName ?? null,
  );
  const conversationId = useAppSelector(
    (state) => state.ui.chats.conversationId,
  );
  const isGroupChat = useAppSelector(
    (state) => state.ui.chats?.isGroupChat ?? null,
  );
  const ShowSpaceModal = useAppSelector(
    (state) => state.ui.chats?.showSpaceModal ?? null,
  );
  const ShowDirectChatModal = useAppSelector(
    (state) => state.ui.chats?.ShowDirectChatModal ?? null,
  );
  const loadingChats = useAppSelector((state) => state.ui.chats.loadingChats);
  const loadingUsers = useAppSelector(
    (state) => state.ui.chats?.loadingUsers ?? null,
  );
  const showDirectChats = useAppSelector(
    (state) => state.ui.chats.showDirectChats,
  );
  const showSpaces = useAppSelector((state) => state.ui.chats.showspaces);
  const dispatch = useAppDispatch();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    socket.emit("joinConversation", conversationId);

    return () => {
      socket.emit("leaveConversation", conversationId);
    };
  }, [conversationId]);

  const createConversation = async (userId: string) => {
    if (!currentUser) return;
    try {
      const conversationRef = await chatsService.create({
        type: isGroupChat ? "group" : "private",
        participants: [currentUser.uid, userId],
        lastMessage: messageInput,
        createdAt: Timestamp.now(),
        createdBy: currentUser.uid,
      });
      const conversationId = conversationRef.id;

      return conversationId;
    } catch (error) {
      console.log("Error Creating Conversation", error);
    }
  };

  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !conversationId || !currentUser) return;

    const socket = getSocket();

    // 2. Send to backend
    socket.emit("sendMessage", {
      conversationId,
      message: {
        text: messageInput,
        senderId: currentUser.uid,
        type: isGroupChat ? "group" : "private",
        seenBy: [],
        read: false,
      },
    });

    // 3. Clear input
    setMessageInput("");
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const msgs = await chatsService.getMessages(conversationId);
      setMessages(msgs);
    };

    fetchMessages();
  }, [conversationId]);
 
  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const socket = getSocket();

    socket.emit("markAsRead", {
      conversationId,
      userId: currentUser.uid,
    });
  }, [currentUser, conversationId]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("messagesRead", ({ userId }) => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          read: true,
        })),
      );
    });

    return () => {
      socket.off("messagesRead");
    };
  }, []);

  //focus input
  useEffect(() => {
    if ((selectedUser || isGroupChat) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser, isGroupChat, conversationId]);

  // display chat under direct section
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoadingUsers(true));
      try {
        const { users } = await usersService.getAll();
        const map: Record<string, User> = {};
        users.forEach((user) => {
          map[user.id] = user;
        });
        setUserMap(map);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        dispatch(setLoadingUsers(false));
      }
    };

    fetchUsers();
  }, []);
  const currentUserData = currentUser ? userMap[currentUser.uid] : null;
  const isAdmin = currentUserData?.role === "Admin";

  //fetch conversation from firestore
  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      dispatch(setLoadingChats(true));

      const snapshot = await getDocs(
        query(
          collection(db, "conversation"),
          where("participants", "array-contains", currentUser.uid),
        ),
      );

      const chats: conversation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<conversation, "id">),
      }));

      setDirectChats(chats.filter((c) => c.type === "private"));
      setSpaces(chats.filter((c) => c.type === "group"));

      dispatch(setLoadingChats(false));
    };

    fetchChats();
  }, [currentUser]);

  //new message
  useEffect(() => {
    const socket = getSocket();
    socket.on("newMessage", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const socket = getSocket();

    socket.emit("markAsRead", {
      conversationId,
      userId: currentUser.uid,
    });

    // RESET unread locally
    setUnreadMsgCount((prev) => ({
      ...prev,
      [conversationId]: 0,
    }));
  }, [currentUser, conversationId]);
  useEffect(() => {
    const socket = getSocket();

    socket.on("messagesRead", () => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          read: true,
        })),
      );
    });

    return () => {
      socket.off("messagesRead");
    };
  }, []);
  if (loadingChats || loadingUsers) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <LoadSpinner />
      </div>
    );
  }
  return (
    <div
      className="flex h-[calc(100vh-60px)] transition-all duration-300 bg-gray-900"
      style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
    >
      <div>
        <ChatSidebar
          directChats={directChats}
          spaces={spaces}
          unreadMsgCount={unreadMsgCount}
          userMap={userMap}
          currentUserId={currentUser?.uid || ""}
          showDirectChats={showDirectChats}
          showSpaces={showSpaces}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <div className="flex flex-1 flex-col bg-blue-950">
        <div className=" p-4 flex items-center">
          {isGroupChat && spaceName ? (
            <div className="flex flex-row w-full justify-between items-center">
              <span>
                <p className="font-bold text-white">{spaceName}</p>
              </span>

              <div className="flex flex-row">
                <span className=" pr-4">
                  {isAdmin && (
                    <UserPlus
                      className="text-white cursor-pointer"
                      size={26}
                      onClick={() => {
                        dispatch(setShowDirectChatModal(true));
                      }}
                    />
                  )}
                </span>
                <span>
                  <X
                    className="text-white cursor-pointer"
                    onClick={() => {
                      dispatch(setConversationId(null));
                      dispatch(setIsGroupChat(false));
                      dispatch(setSpaceName(null));
                      setSelectedUser(null);
                      setMessages([]);
                    }}
                    size={26}
                  />
                </span>
              </div>
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
                    dispatch(setConversationId(null));
                    setSelectedUser(null);
                    dispatch(setIsGroupChat(false));
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

        <div
          className={`flex-1 overflow-y-auto p-6 bg-gray-100 ${
            !selectedUser && !isGroupChat
              ? "flex items-center justify-center"
              : ""
          }`}
        >
          {!selectedUser && !isGroupChat ? (
            <NoConversation />
          ) : (
            <div className="w-full space-y-4">
              {messages.length === 0 && (
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
          )}
        </div>

        {(selectedUser || isGroupChat) && (
          <div className=" flex items-center gap-4 p-4 bg-gray-100 border-t">
            <input
              ref={inputRef}
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
              type="submit"
              className={`px-6 py-2 rounded-lg text-white ${
                messageInput.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!messageInput.trim()}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        )}
      </div>

      {ShowDirectChatModal && (
        <DirectChatModal
          isOpen={ShowDirectChatModal}
          onClose={() => dispatch(setShowDirectChatModal(false))}
          isGroup={isGroupChat}
          onUserSelect={async (user) => {
            if (!currentUser) return;

            if (isGroupChat && conversationId) {
              try {
                const result = await chatsService.addUserToGroup(
                  conversationId,
                  user.id,
                );

                if (result?.error === "A") {
                  toast.error("User already exists in the group");
                  return;
                }
                if (result?.error === "B") {
                  toast.error("Conversation not found");
                  return;
                }
                toast.success("User added to group");
                dispatch(setShowDirectChatModal(false));
              } catch (error) {
                toast.error("Something went wrong");
              }
            }
            setSelectedUser(user);
            const q = query(
              collection(db, "conversation"),
              where("type", "==", "private"),
              where("participants", "array-contains", currentUser.uid),
            );
            const snapshot = await getDocs(q);
            let existingConversation = null;
            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.participants.includes(user.id)) {
                existingConversation = doc.id;
              }
            });
            if (existingConversation) {
              dispatch(setConversationId(existingConversation));
            } else {
              const convoId = await createConversation(user.id);
              if (convoId) dispatch(setConversationId(convoId));
            }
            dispatch(setShowDirectChatModal(false));
          }}
        />
      )}
      {ShowSpaceModal && (
        <SpaceModal
          isOpen={ShowSpaceModal}
          onClose={() => dispatch(setShowSpaceModal(false))}
          onUserSelect={async (user, spaceName) => {
            if (!currentUser) return;
            dispatch(setIsGroupChat(true));
            dispatch(setSpaceName(spaceName || "Group"));
            setSelectedUser(null);
            const participantIds = Array.from(
              new Set([currentUser.uid, ...user.map((u) => u.id)]),
            );
            const conversationRef = await chatsService.create({
              type: "group",
              name: spaceName,
              participants: participantIds,
              createdAt: Timestamp.now(),
              createdBy: currentUser.uid,
            });
            dispatch(setConversationId(conversationRef.id));
            dispatch(setShowSpaceModal(false));
          }}
        />
      )}
    </div>
  );
};
export default ChatSection;
