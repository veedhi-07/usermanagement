import AuthLayout from "../../../components/auth-layout";
import { FormField, loginFields } from "../../../components/form-field";
import { Button, Modal, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import loginImage from "../../../assets/login.png";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../../../components/validation";

import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../components/firebase";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type {ChangeEvent} from "react";

const Login = () => {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();

  // --- Forgot Password Modal State ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  // --- Handle Formik Login ---
  const handleLogin = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Login successful!", { position: "top-center" });
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // --- Handle Forgot Password ---
  const handleForgotPassword = async () => {
    if (!resetEmail) return;
    setLoadingReset(true);

    try {
      const authInstance = getAuth();
      await sendPasswordResetEmail(authInstance, resetEmail);
      toast.success("Password reset email sent!", { position: "top-center" });
      setResetEmail("");
      setShowForgotModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email", { position: "top-center" });
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <AuthLayout title="Welcome Back" image={loginImage}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              {loginFields.map((field) => (
                <FormField
                  key={field.id}
                  {...field}
                  value={values[field.id as keyof typeof values] ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.id as keyof typeof errors]}
                  touched={touched[field.id as keyof typeof touched]}
                />
              ))}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black! hover:bg-gray-900! text-white rounded-xl py-3"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="flex justify-between mt-2">
                <p className="text-black text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold underline hover:text-[#FF859B]"
                  >
                    Sign up
                  </Link>
                </p>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AuthLayout>

      {/* --- Forgot Password Modal  --- */}
      <Modal show={showForgotModal} size="md" onClose={() => setShowForgotModal(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Forgot Password</h2>
          <p>Enter your registered email to receive a password reset link.</p>

          <div>
            <Label htmlFor="resetEmail">Email</Label>
            <TextInput
              id="resetEmail"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setResetEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              color="light"
              onClick={handleForgotPassword}
              disabled={!resetEmail || loadingReset}
            >
              {loadingReset ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button color="gray" onClick={() => setShowForgotModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
