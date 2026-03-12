import { useState } from "react";
import { Modal } from "flowbite-react";
import { FormField } from "../../components/form-field";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import Button from "../../components/Button";
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
    } catch (err: unknown) {
      toast.error("Failed to send reset email", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} size="md" onClose={onClose}>
        {/* Modal content */}
        <div className="p-6 space-y-4  text-white! dark:text-white!">
          <h2 className="text-xl font-bold text-white!">Forgot Password</h2>
          <p>Enter your registered email to receive a password reset link.</p>
          <div>
            <Formik initialValues={{ email: "" }} onSubmit={handleReset}>
              {({ values, handleChange, handleBlur, errors, touched }) => (
                <Form>
                  <FormField
                    id="email"
                    label="Email"
                    placeholder="name@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                  />
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleReset} disabled={!email || loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
