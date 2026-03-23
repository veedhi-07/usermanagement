import CommonModall from "../../components/common/commonmodal";
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
import { User as UserIcon } from "lucide-react";
import FormField from "../../components/common/form-field/formfield";
import Button from "../../components/common/button";
import type { User } from "../../types/index";
type SpaceModalProps = {
  onClose: () => void;
  isOpen: boolean;
  onUserSelect: (users: User[], spaceName: string) => void;
};

const SpaceModal = ({ onClose, onUserSelect, isOpen }: SpaceModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [spaceName, setSpaceName] = useState("");
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
    <CommonModall onClose={onClose} isOpen={isOpen} title="Create A Space">
      <FormField
        id="chatname"
        type="text"
        label="Space Name:"
        placeholder="Enter Space Name"
        value={spaceName}
        onChange={(e) => setSpaceName(e.target.value)}
        className="pr-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none outline-none"
      />

      <div className="mt-2">
        <div
          ref={parentRef}
          className="h-75 overflow-auto p-2 bg-gray-200 shadow-md border border-gray-200 hide-scrollbar rounded-2xl"
        >
          <div className="p-3 border-b border-black sticky top-0 bg-gray-200 z-10">
            <FormField
              type="text"
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 text-sm 
           bg-gray-200 border border-gray-300
           focus:ring-1 focus:ring-blue-400 outline-none rounded-2xl"
            />
          </div>

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
                    toggleUserSelection(user);
                  }}
                  className={`flex items-center p-2 border-b cursor-pointer
                       ${
                         selectedUsers.some((u) => u.id === user.id)
                           ? "bg-blue-200"
                           : ""
                       }`}
                >
                  <UserIcon size={18} className="mr-3 text-gray-500" />
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {selectedUsers.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button
            className="w-26 p-1"
            onClick={() => {
              if (selectedUsers.length === 0) return;
              onUserSelect(selectedUsers, spaceName);
              onClose();
            }}
          >
            Create Space
          </Button>
        </div>
      )}
    </CommonModall>
  );
};
export default SpaceModal;
