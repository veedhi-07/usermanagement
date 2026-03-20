import CommonModall from "../../components/commonmodal";
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
import FormField from "../../components/form-field/formfield";
import Button from "../../components/button";
import type { User, Role, ProfileData } from "../../../src/types/index";
type DirectChatModalProps = {
  onClose: () => void;
  onUserSelect: (users: User) => void;
  isOpen: boolean;
  isGroup?: boolean;
};

const DirectChatModal = ({
  onClose,
  onUserSelect,
  isOpen,
  isGroup,
}: DirectChatModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
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
    <CommonModall onClose={onClose} title={"Users List"} isOpen={isOpen}>
      <div className="pb-2">
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
                  setSelectedUsers([user]);
                }}
                className={`flex items-center p-2 border-b cursor-pointer
                     ${
                       selectedUsers[0]?.id === user.id
                         ? "bg-blue-200 text-black"
                         : "hover:bg-gray-200"
                     }`}
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
      {selectedUsers.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              if (selectedUsers.length === 0) return;
              onUserSelect(selectedUsers[0]);
              onClose();
            }}
          >
            {isGroup ? "Add Uer" : "Start Chat"}
          </Button>
        </div>
      )}
    </CommonModall>
  );
};
export default DirectChatModal;
