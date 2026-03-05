import AuthLayout from "../../../components/auth-layout";
import { FormField, signupFields } from "../../../components/form-field";
import { Button } from "flowbite-react";
import signupImage from "../../../assets/signup.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { signupSchema } from "../../../components/validation";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

  console.log("Current user:", auth.currentUser);

  const handleRegister = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: values.firstname,
        lastName: values.lastname,
        role: "user",
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db,"chat", user.uid ),{
      });

      toast.success("User Registered Successfully!", {
        position: "top-center",
      });
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Signup error:", error.message);

        toast.error(error.message, {
          position: "top-center",
        });
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthLayout title="Create Account" image={signupImage}>
        <Formik
          initialValues={initialValues}
          validationSchema={signupSchema}
          onSubmit={handleRegister}
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
              {signupFields.map((field) => (
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
              <div className="flex flex-row">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black! cursor-pointer hover:bg-gray-900! text-white rounded-xl py-3 w-48"
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>

                <div className="ml-3">
                  <p className="text-black text-sm">
                    Don’t have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold underline hover:text-[#FF859B]"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </>
  );
};

export default Signup;
