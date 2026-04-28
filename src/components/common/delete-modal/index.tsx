import { useUser } from "../../../features/users/hooks/useuser-hook";
import { useRole } from "../../../features/roles/hooks/userole-hook";
import { Modal } from "../../../components/ui/modal";
import toast from "react-hot-toast";
import { User, Role } from "../../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
  type: "user" | "role";
}

export default function DeleteModal({ isOpen, onClose, id, type }: Props) {
  const { deleteUser } = useUser();
  const { deleteRole } = useRole();

  const isUser = type === "user";

  const { mutate, isPending } = isUser ? deleteUser : deleteRole;

  if (!id) return null;

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => {
        toast.success(`${type} deleted successfully`);
        onClose();
      },
      onError: () => {
        toast.error(`Failed to delete ${type}`);
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this {type}?
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
