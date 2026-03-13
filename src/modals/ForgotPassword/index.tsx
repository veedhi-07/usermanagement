import { useState } from "react";
// import { Modal } from "flowbite-react";
import FormField from "../../components/form-field/formfield";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import Button from "../../components/button";
import CommonModal from "../../components/commonmodal";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
}: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);

  const handleReset = async (values: { email: string }) => {
    if (!values.email) return;

    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Password reset email sent!", { position: "top-center" });
      onClose();
    } catch (err) {
      toast.error("Failed to send reset email", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CommonModal isOpen={isOpen} onClose={onClose} title="Forgot Password">
        <p>Enter your registered email to receive a password reset link.</p>
        <div>
          <Formik initialValues={{ email: "" }} onSubmit={handleReset}>
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <FormField
                  id="email"
                  label=""
                  placeholder="name@email.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  touched={touched.email}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Link"}
                  </Button>
                  <Button type="button" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CommonModal>
    </>
  );
}
