import AuthLayout from "../../../components/auth-layout";
import { FormField, loginFields } from "../../../components/form-field";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import loginImage from "../../../assets/login.png";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../../../components/validation/authSchema";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../components/firebase";

import { useNavigate } from "react-router-dom";


const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };
const navigate = useNavigate();

  const handleLogin = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      toast.success("Login successful!", {
        position: "top-center",
      });
       navigate("/home");
       
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-center",
        });
      }
    } finally {
      setSubmitting(false);
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
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            isSubmitting,
          }) => (
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
                className="!bg-black hover:!bg-gray-900 text-white rounded-xl py-3"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <p className="text-black text-sm mt-2">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold underline hover:text-[#FF859B]"
                >
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </>
  );
};

export default Login;
