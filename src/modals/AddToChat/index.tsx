import { db } from "../../components/firebase";
import { getAuth } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
// import { HiUserCircle } from "react-icons/hi";
// import { ListGroup, ListGroupItem } from "flowbite-react";

type AddToChatModalProps = {
  onClose: () => void;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
};

const AddToChatModal = ({ onClose }: AddToChatModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));

          const data: User[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<User, "id">),
          }));

          const filteredUsers = data.filter((u) => u.id !== user.uid);

          setUsers(filteredUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-blue-200 rounded-lg shadow-lg w-[400px] h-[800px] p-6 relative">
          <h1 className="text-2xl font-black">Users List</h1>
          <button onClick={onClose} className="absolute right-2 top-5">
            <X size={25} />
          </button>
          {users.map((user) => (
            <ol space-y-2>
              <li>
                <div className="flex flex-row p-1">
                <span className="pt-1">
                <User size={18} />
                </span>
                <span>
                 {user.firstName} {user.lastName}{" "}
                </span>
                </div>
              </li>
            </ol>
          ))}
        </div>
      </div>
    </>
  );
};
export default AddToChatModal;

// import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Select } from "flowbite-react";
// import { useState } from "react";

// export function Component() {
//   const [openModal, setOpenModal] = useState(true);
//   const [modalPlacement, setModalPlacement] = useState("center");

//   return (
//     <>
//       <div className="flex flex-wrap gap-4">
//         <div className="w-40">
//           <Select defaultValue="center" onChange={(event) => setModalPlacement(event.target.value)}>
//             <option value="center">Center</option>
//             <option value="top-left">Top left</option>
//             <option value="top-center">Top center</option>
//             <option value="top-right">Top right</option>
//             <option value="center-left">Center left</option>
//             <option value="center-right">Center right</option>
//             <option value="bottom-right">Bottom right</option>
//             <option value="bottom-center">Bottom center</option>
//             <option value="bottom-left">Bottom left</option>
//           </Select>
//         </div>
//         <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
//       </div>
//       <Modal show={openModal} position={modalPlacement} onClose={() => setOpenModal(false)}>
//         <ModalHeader>Small modal</ModalHeader>
//         <ModalBody>
//           <div className="space-y-6 p-6">
//             <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//               With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
//               companies around the world are updating their terms of service agreements to comply.
//             </p>
//             <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
//               The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
//               to ensure a common set of data rights in the European Union. It requires organizations to notify users as
//               soon as possible of high-risk data breaches that could personally affect them.
//             </p>
//           </div>
//         </ModalBody>
//       </Modal>
//     </>
//   );
// }
