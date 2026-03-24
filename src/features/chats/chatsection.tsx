import { useState, useEffect, useRef } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  arrayUnion,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  PlusIcon,
  ChevronDown,
  ChevronRight,
  X,
  UserRound,
  Users,
  UserPlus,
} from "lucide-react";
// import AddToChatModal from "../../../modals/addtochat";
import DirectChatModal from "../../../modals/directchatmodal";
import SpaceModal from "../../../modals/spacemodal";
import { Timestamp } from "firebase/firestore";
import "react-simple-keyboard/build/css/index.css";
import Button from "../../../components/common/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import LoadSpinner from "../../../components/common/spinner";
import { usersService } from "../../../services/firebase/usersService";
import FormField from "../../../components/common/form-field/formfield";
import type { User, conversation, Message } from "../../../../src/types/index";
import { toast } from "react-toastify";
import {
  setSpaceName,
  setIsGroupChat,
  setShowDirectChatModal,
  setLoadingChats,
  setLoadingUsers,
  setShowSpaceModal,
} from "../../../redux/reducer/uiSlice";
type Props = {
  sidebarOpen: boolean;
};

const ChatSection = ({ sidebarOpen }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  // const [spaceName, setSpaceName] = useState<string | null>(null);
  // const [isGroupChat, setIsGroupChat] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState<Record<string, number>>(
    {},
  );
  // const [ShowSpaceModal, setShowSpaceModal] = useState(false);
  // const [ShowDirectChatModal, setShowDirectChatModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showDirectChats, setShowDirectChats] = useState(true);
  const [directChats, setDirectChats] = useState<conversation[]>([]);
  // const [loadingChats, setLoadingChats] = useState(true);
  // const [loadingUsers, setLoadingUsers] = useState(true);
  const [showSpaces, setShowSpaces] = useState(true);
  const [spaces, setSpaces] = useState<conversation[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const spaceName = useAppSelector(
    (state) => state.ui.chats?.spaceName ?? null,
  );
  const isGroupChat = useAppSelector(
    (state) => state.ui.chats?.isGroupChat ?? null,
  );
  // const showSpaces = useAppSelector((state) => state.ui.chats.showSpaces);
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
  const dispatch = useAppDispatch();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const inputRef = useRef<HTMLInputElement>(null);
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
      seenBy: [],
      createdAt: Timestamp.now(),
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
              seenBy: arrayUnion(currentUser.uid),
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

  //focus input
  useEffect(() => {
    if ((selectedUser || isGroupChat) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser, isGroupChat, conversationId]);

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

    dispatch(setLoadingChats(true));
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
      dispatch(setLoadingChats(false));
    });
    return () => unsubscribe();
  }, [currentUser]);

  // display chat under direct section
  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoadingUsers(true));
      // const snapshot = await getDocs(collection(db, "users"));
      try {
        const users = await usersService.getAll();

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
      <div className="w-64">
        <div className="flex flex-row">
          <span>
            <div
              onClick={() => setShowDirectChats((prev) => !prev)}
              className="pt-4 cursor-pointer text-white"
            >
              {showDirectChats ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </div>
          </span>
          <span>
            <div className="pt-3 text-lg cursor-pointer text-white">
              Direct Messages
            </div>
          </span>
          <span>
            <div className="pt-3 ml-16 cursor-pointer text-white">
              <PlusIcon
                size={24}
                onClick={() => dispatch(setShowDirectChatModal(true))}
              />
            </div>
          </span>
        </div>
        {showDirectChats && (
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
                    dispatch(setIsGroupChat(false));
                  }}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span>
                      <UserRound className="w-5 h-5 text-white" />
                    </span>
                    <span>
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : "Loading..."}
                    </span>
                    <div className="pl-25">
                      {unreadMsgCount[chat.id] > 0 && (
                        <span className="bg-red-500 text-xs py-1 px-2 rounded-full">
                          {unreadMsgCount[chat.id]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-row">
          <span>
            <div
              onClick={() => setShowSpaces((prev) => !prev)}
              className="  pt-31 cursor-pointer text-white"
            >
              {showSpaces ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </div>
          </span>
          <span>
            <div className="  pt-30 text-lg cursor-pointer text-white">
              Spaces
            </div>
          </span>
          <span>
            <div className="pt-30 ml-34 cursor-pointer text-white">
              <PlusIcon
                size={24}
                onClick={() => dispatch(setShowSpaceModal(true))}
              />
            </div>
          </span>
        </div>
        {showSpaces && (
          <div className="mt-3">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="p-2 text-white cursor-pointer hover:bg-gray-700 rounded"
                onClick={() => {
                  setConversationId(space.id);
                  dispatch(setIsGroupChat(true));
                  dispatch(setSpaceName(space.name || "Group"));
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
        )}
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
                      setConversationId(null);
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
                    setConversationId(null);
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
            <div className="bg-white shadow-lg rounded-xl p-8 text-center w-87.5">
              <Users className="mx-auto mb-4 text-blue-500" size={40} />

              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                No Conversation Selected
              </h2>

              <p className="text-gray-500 text-sm">
                Select a user or create a group to start chatting.
              </p>
            </div>
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
                const convoRef = doc(db, "conversation", conversationId);

                const snapshot = await getDoc(convoRef);

                if (!snapshot.exists()) return;

                const data = snapshot.data();
                const participants: string[] = data.participants || [];

                if (participants.includes(user.id)) {
                  toast.error("User already exists in the group");
                  return;
                }

                await updateDoc(convoRef, {
                  participants: arrayUnion(user.id),
                });

                toast.success("User added to group");
              } catch (err) {
                console.log("Error adding user", err);
                toast.error("Something went wrong");
              }

              dispatch(setShowDirectChatModal(false));
              return;
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
              setConversationId(existingConversation);
            } else {
              const convoId = await createConversation(user.id);
              if (convoId) setConversationId(convoId);
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

            const conversationRef = await addDoc(
              collection(db, "conversation"),
              {
                type: "group",
                name: spaceName,
                participants: participantIds,
                createdAt: Timestamp.now(),
                createdBy: currentUser.uid,
              },
            );

            setConversationId(conversationRef.id);
            dispatch(setShowSpaceModal(false));
          }}
        />
      )}
    </div>
  );
};
export default ChatSection;
