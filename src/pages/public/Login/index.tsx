import AuthLayout from "../../../components/auth-layout";
import FormField from "../../../components/form-field/formfield";
import { Modal, Label } from "flowbite-react";
import { Link } from "react-router-dom";
import loginImage from "../../../assets/login.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { setPermissions } from "../../../redux/reducer/permissionSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../../../components/validation";
import ForgotPasswordModal from "../../../../src/modals/forgotpassword";
import {
  signInWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import type { ChangeEvent } from "react";
import Button from "../../../components/button";

const Login = () => {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  // Handle Formik Login
  const handleLogin = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      //  Login with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const uid = userCredential.user.uid;

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data();
      const userRole = userData.role;

      // Fetch role permissions directly by document ID
      const roleDocRef = doc(db, "roles", userRole);
      const roleDocSnap = await getDoc(roleDocRef);

      if (roleDocSnap.exists()) {
        dispatch(setPermissions(roleDocSnap.data().permissions));
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else {
        console.log("Role not found in Firestore");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Invalid Login Credentials", { position: "top-center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // // Handle Forgot Password
  // const handleForgotPassword = async () => {
  //   if (!resetEmail) return;
  //   setLoadingReset(true);

  //   try {
  //     const authInstance = getAuth();
  //     await sendPasswordResetEmail(authInstance, resetEmail);
  //     toast.success("Password reset email sent!", { position: "top-center" });
  //     setResetEmail("");
  //     setShowForgotModal(false);
  //   } catch (error: any) {
  //     toast.error(error.message || "Failed to send reset email", {
  //       position: "top-center",
  //     });
  //   } finally {
  //     setLoadingReset(false);
  //   }
  // };

  return (
    <>
      <AuthLayout title="Welcome Back" image={loginImage}>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            isSubmitting,
          }) => (
            <Form className="flex flex-col gap-5">
              {/* {loginFields.map((field) => (
                <FormField
                  key={field.id}
                  {...field}
                  value={values[field.id as keyof typeof values] ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.id as keyof typeof errors]}
                  touched={touched[field.id as keyof typeof touched]}
                />
              ))} */}
              <div>
                <div>
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
                </div>
                <div>
                  <FormField
                    id="password"
                    label="Password"
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                  />
                </div>
              </div>
              <div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className=" cursor-pointer text-sm text-blue-600 hover:underline pl-5"
                >
                  Forgot Password?
                </button>
              </div>
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
              </div>
            </Form>
          )}
        </Formik>
      </AuthLayout>

      {/* Forgot Password Modal
      <Modal
        show={showForgotModal}
        size="md"
        onClose={() => setShowForgotModal(false)}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Forgot Password</h2>
          <p>Enter your registered email to receive a password reset link.</p>

          <div>
            <Label htmlFor="resetEmail">Email</Label>
            <FormField
              id="resetEmail"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setResetEmail(e.target.value)
              }
              onBlur={() => {}}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={handleForgotPassword}
              disabled={!resetEmail || loadingReset}
            >
              {loadingReset ? "Sending..." : "Send Reset Link"}
            </Button>
            <Button onClick={() => setShowForgotModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal> */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </>
  );
};

export default Login;
