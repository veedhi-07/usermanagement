import { useState } from "react";
import { Modal, Button, Label, TextInput } from "flowbite-react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  show,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!", { position: "top-center" });
      setEmail("");
      onClose();
    } catch (err: any) {
      toast.error("Failed to send reset email", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
    show={show} 
    size="md" 
    onClose={onClose}>
      {/* Modal content */}
      <div className="p-6 space-y-4  text-white! dark:text-white!">
        <h2 className="text-xl font-bold text-white!">Forgot Password</h2>
        <p >Enter your registered email to receive a password reset link.</p>
        <div>
          <Label htmlFor="resetEmail">Email</Label>
          <TextInput
            id="resetEmail"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            color="light"
            onClick={handleReset}
            disabled={!email || loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
