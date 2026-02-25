import { FormField, signupFields } from "../../components/form-field";
import { Button } from "flowbite-react";
import { X } from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";

import { signupSchema } from "../../components/validation/index";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { secondaryAuth } from "../../components/firebase";
import { db } from "../../components/firebase";
import { setDoc, doc, serverTimestamp,getDocs,collection } from "firebase/firestore";

type AddUserModalProps = {
  onClose: () => void;
};

const AddUserModal = ({ onClose }: AddUserModalProps) => {
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role:"",
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
        role: values.role,
        createdAt: serverTimestamp(),
      });

      toast.success("New User Created", {
        position: "top-center",
      });

      onClose(); 
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
    const[roles, setRoles] = useState<string[]>([]);
    useEffect(() =>{
      const fetchRoles = async () => {
        try{
          const snapshot = await getDocs(collection(db,"roles"));
          const roleList = snapshot.docs.map((doc) => doc.data().name);
          setRoles(roleList);
        }
        catch(error){
          console.log("Error",error);
        }
      };
      fetchRoles();
    }, []);
  return (
    <div>
      <ToastContainer />

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-115 relative">
          
          <button
            onClick={onClose}
            className="absolute top-1 right-3"
          >
            <X size={25} />
          </button>

          <div className="bg-white p-6 rounded-lg shadow-lg w-105">
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
                setFieldValue,  
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
            <div>
            <label className="text-sm text-gray-600">Role</label>
             <select
              value={values.role}
              onChange={(e) =>
              setFieldValue("role", e.target.value)
            }
              className="border rounded-lg p-2 w-full"
            >
              <option value="">Select Role</option>

              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            {touched.role && errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="bg-blue-600! hover:bg-gray-600! text-white py-3"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600! hover:bg-gray-600! text-white py-3"
                    >
                      {isSubmitting ? "Adding User..." : "Add User"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;