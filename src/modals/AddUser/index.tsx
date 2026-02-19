
import { FormField, signupFields } from "../../components/form-field";
import { Button } from "flowbite-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";

import { signupSchema } from "../../components/validation/index";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { secondaryAuth} from "../../components/firebase";
import { db } from "../../components/firebase";
import { setDoc, doc } from "firebase/firestore";

import { serverTimestamp } from "firebase/firestore";

const AddUserModal = () => {
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

  const handleRegister = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        values.email,
        values.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: values.firstname,
        lastName: values.lastname,
        role: "user", 
        createdAt: serverTimestamp(),
      });

      toast.success("New User Created", {
        position: "top-center",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);

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
    <div>
      <ToastContainer />
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"> 
   <div className="bg-white p-6 rounded-lg shadow-lg w-[460px]"> 
     <div className="bg-blue-300 p-6 rounded-lg shadow-lg w-[420px]">
        <h2 className="text-xl font-bold mb-4">Add User</h2>
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue! hover:bg-gray-900! text-white rounded-xl py-3"
              >
                {isSubmitting ? "Adding User..." : "Add User"}
              </Button>
            </Form>
          )}
        </Formik>
        </div>
        </div>
        </div>
    </div>

  );
}
export default AddUserModal

