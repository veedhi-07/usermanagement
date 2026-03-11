import { db } from "../../components/firebase";
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
import { X, User as UserIcon, SearchIcon } from "lucide-react";
import Button from "../../components/Button";

type CreateGroupModalProps = {
  onClose: () => void;
 
};
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};

const CreateGroupModal = ({ onClose }: CreateGroupModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-6 relative">
        <h1 className="text-2xl font-black mb-4 text-white">
          Create Group Chat
        </h1>

        <button
          onClick={onClose}
          className="absolute right-2 top-5 text-white "
        >
          <X size={25} />
        </button>
        <div className="bg-white relative w-full max-w-sm  mb-1 rounded-3xl h-10">
          <input
            placeholder="Enter Chat Name"
           
            className="pl-5 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white-500"
          />
        </div>
        <div className="text-white pt-1">
          <p>Add Members:</p>
        </div>
        <div className="relative w-full max-w-sm bg-blue-200 mb-1 rounded-3xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white-500"
          />
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
        <div>
          <Button>
            Create Group{" "}
          </Button>
        </div>
        {loading && <p className="mt-2 text-sm">Loading...</p>}
        {!hasMore && <p className="mt-2 text-sm">No more users</p>}
      </div>
    </div>
  );
};

export default CreateGroupModal;
