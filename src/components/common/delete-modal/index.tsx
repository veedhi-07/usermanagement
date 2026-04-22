import { useUser } from "../../../features/users/hooks/useuser-hook";
import { Modal } from "../../../components/ui/modal";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function DeleteUserModal({ isOpen, onClose, user }: Props) {
  const { deleteUser } = useUser();
  const { mutate, isPending } = deleteUser;

  if (!user) return null;

  const handleDelete = () => {
    mutate(user.id, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to delete user");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded"
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded"
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
