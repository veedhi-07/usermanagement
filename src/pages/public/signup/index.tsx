import AuthLayout from "../../../components/auth-layout";
import { FormField } from "../../../components/form-field";
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
import Button from "../../../components/Button";

const Signup = () => {
  const navigate = useNavigate();
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

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
            setFieldValue,
          }) => (
            <Form className="flex flex-col gap-5">
              {/* <FormField
                  key={field.id}
                  {...field}
                  value={values[field.id as keyof typeof values] ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors[field.id as keyof typeof errors]}
                  touched={touched[field.id as keyof typeof touched]}
                /> */}
              <div>
                <div>
                  <FormField
                    id="firstname"
                    label="First Name"
                    placeholder="Enter first name"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.firstname}
                    touched={touched.firstname}
                  />
                </div>
                <div>
                  <FormField
                    id="lastname"
                    label="Last Name"
                    placeholder="Enter last name"
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lastname}
                    touched={touched.lastname}
                  />
                </div>
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
                <div>
                  <FormField
                    id="cpassword"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>

                <div className="ml-3 pt-3">
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
