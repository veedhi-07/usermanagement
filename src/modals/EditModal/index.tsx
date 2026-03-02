import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "../../components/form-field/FormField";
import { db } from "../../components/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type Props = {
  user: User;
  onClose: () => void;
  onSave: (values: Omit<User, "id">) => Promise<void>;
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

export default function EditUserModal({ user, onClose, onSave }: Props) {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-105">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <Formik
          initialValues={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await onSave(values);

              toast.success("User Edited Successfully!", {
                position: "top-center",
              });

              onClose(); // close modal after success
            } catch (error) {
              toast.error("Failed to update user");
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Form className="space-y-3">
              <FormField
                id="firstName"
                label="First Name"
                placeholder="First name"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
              />

              <FormField
                id="lastName"
                label="Last Name"
                placeholder="Last name"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
              />

              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 hover:bg-gray-600! text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-gray-600! text-white"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
