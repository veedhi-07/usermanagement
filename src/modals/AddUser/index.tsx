import { FormField, signupFields } from "../../components/form-field";
import Button from "../../components/Button";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import type { FormikHelpers } from "formik";
import { Timestamp } from "firebase/firestore";
import { signupSchema } from "../../components/validation/index";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { secondaryAuth } from "../../components/firebase";
import { db } from "../../components/firebase";
import {
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  collection,
} from "firebase/firestore";
import type { User } from "../../../src/pages/private/Users/index";

type AddUserModalProps = {
  onClose: () => void;
  onSave: (newUser: User) => void;
};

const AddUserModal = ({ onClose, onSave }: AddUserModalProps) => {
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  };

  const handleRegister = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        values.email,
        values.password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: values.firstname,
        lastName: values.lastname,
        role: values.role,
        createdAt: serverTimestamp(),
      });

      if (!user) return;
      const newUser: User = {
        id: user.uid,
        email: user.email ?? "",
        firstName: values.firstname,
        lastName: values.lastname,
        role: values.role,
        createdAt: Timestamp.now(),
      };

      onSave(newUser);
      toast.success("New User Created");

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "roles"));
        const roleList = snapshot.docs.map((doc) => doc.data().name);
        setRoles(roleList);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchRoles();
  }, []);
  return (
    <div>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-gray-200 p-6 rounded-lg  shadow-lg w-115 relative">
          <button onClick={onClose} className="absolute bottom-168 right-2">
            <X size={25} />
          </button>

          <div className="bg-white p-6 rounded-lg shadow-lg w-105 border">
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
                      onChange={(e) => setFieldValue("role", e.target.value)}
                      className="border rounded-lg p-2 w-full"
                    >
                      <option value="">Select Role</option>

                      {roles
                        .filter((role) => role.trim().toLowerCase() !== "admin")
                        .map((role) => (
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
                      onClick={onClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
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
