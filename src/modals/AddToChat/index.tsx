import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { X, User as UserIcon, Users } from "lucide-react";
import FormField from "../../components/form-field/formfield";
import Button from "../../components/button";

type AddToChatModalProps = {
  onClose: () => void;
  onUserSelect: (users: User | User[], chatName?: string) => void;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

const AddToChatModal = ({ onClose, onUserSelect }: AddToChatModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 5;

  const fetchUsers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    let q;

    if (lastDoc) {
      q = query(
        collection(db, "users"),
        orderBy("firstName"),
        startAfter(lastDoc),
        limit(itemsPerPage),
      );
    } else {
      q = query(
        collection(db, "users"),
        orderBy("firstName"),
        limit(itemsPerPage),
      );
    }

    const snapshot = await getDocs(q);

    const newUsers: User[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));

    const filtered = newUsers.filter((u) => u.id !== currentUser?.uid);

    setUsers((prev) => [...prev, ...filtered]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === itemsPerPage);

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (lastItem && lastItem.index >= users.length - 1 && hasMore && !loading) {
      fetchUsers();
    }
  }, [rowVirtualizer.getVirtualItems(), users, hasMore, loading]);

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);

      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6 relative">
        <h1 className="text-2xl font-black mb-4 text-white">Users List</h1>
        <button
          onClick={onClose}
          className="absolute right-2 top-5 text-white "
        >
          <X size={25} />
        </button>
        <div className="flex flex-row w-full">
          <span>
            <Users size={18} className="text-white" />
          </span>
          <span>
            {/* <Button
              type="button"
              className="mt-3 w-full"
              disabled={selectedUsers.length < 2 || !chatName}
              onClick={() => {
                onUserSelect(selectedUsers, chatName);
              }}
            >
              Create Space
            </Button> */}

            {/* <Button
              type="button"
              className=" flex bg-transparent! w-full pl-2"
              onClick={() => {
                setIsCreatingSpace(true);
                onUserSelect(selectedUsers, chatName);
              }}
            >
              Create A Space
            </Button> */}
            <Button
              type="button"
              className="flex bg-transparent! w-full pl-2"
              onClick={() => {
                setIsCreatingSpace(true);
              }}
            >
              Create A Space
            </Button>
          </span>
        </div>

        {isCreatingSpace && (
          <FormField
            id="chatname"
            type="text"
            placeholder="Enter Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="pr-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none outline-none"
          />
        )}
        <div className="pb-2">
          {/* <div className="relative w-full max-w-sm bg-white rounded-lg "> */}
          {/* <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
              <SearchIcon size={20} />
            </span> */}
          <FormField
            type="text"
            id=""
            placeholder="Search Users"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className=" pr-4 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none outline-none"
          />
          {/* </div> */}
        </div>
        <div
          ref={parentRef}
          className="h-75 overflow-auto border rounded bg-white hide-scrollbar"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const user = filteredUsers[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  onClick={() => {
                    if (!isCreatingSpace) {
                      onUserSelect(user);
                    } else {
                      toggleUserSelection(user);
                    }
                  }}
                  className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-200"
                >
                  <UserIcon size={18} className="mr-2" />
                  <span className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {isCreatingSpace && (
          <Button
            type="button"
            className="mt-3 w-full"
            disabled={selectedUsers.length < 2 || !chatName}
            onClick={() => {
              onUserSelect(selectedUsers, chatName);
              onClose();
            }}
          >
            Create Space
          </Button>
        )}
        {loading && <p className="mt-2 text-sm">Loading...</p>}
      </div>
    </div>
  );
};

export default AddToChatModal;
