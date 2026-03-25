import AuthLayout from "../../../components/layout/auth-layout";
import FormField from "../../../components/common/form-field/formfield";
import { Link } from "react-router-dom";
import loginImage from "../../../assets/login.png";
import { setPermissions } from "../../../redux/reducer/permission-slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../../../utils/validation";
import ForgotPasswordModal from "../../../../src/modals/forgotpassword-modal";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../../../components/common/button";
import { usersService } from "../../../services/firebase/users-service";
import { rolesService } from "../../../services/firebase/roles-service";
const Login = () => {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showForgotModal, setShowForgotModal] = useState(false);

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

      const userDoc = await usersService.getById(uid);
      if (!userDoc) {
        throw new Error("User profile not found");
      }
      const userRole = userDoc.role;


      const roles = await rolesService.getAll();
      const role = roles.find((r) => r.id === userRole);

      if (!role) {
        console.log("Role not found");
        return;
      }

      dispatch(setPermissions(role.permissions));
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Invalid Login Credentials", { position: "top-center" });
      }
    } finally {
      setSubmitting(false);
    }
  };

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

      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />
    </>
  );
};

export default Login;
