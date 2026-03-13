import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { Formik, Form } from "formik";
import FormField from "../../components/form-field/formfield";
import Button from "../../components/button";
import { signupSchema } from "../../components/validation";
import { db, secondaryAuth } from "../../services/firebase";
import type { User } from "../../pages/private/users";
import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import type { FormikHelpers } from "formik";

interface ModalProps {
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onSubmit?: () => void;
  user?: User;
  mode?: "add" | "edit";
  onSave?: (user: User) => void;
}

const CommonModal: FC<ModalProps> = ({
  className,
  disabled,
  isOpen,
  onClose,
  title,
  children,
  footer,
  onSubmit,
  user,
  onSave,
  mode,
  ...rest
}) => {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const snapshot = await getDocs(collection(db, "roles"));
      const roleList = snapshot.docs.map((doc) => doc.data().name);
      setRoles(roleList);
    };

    fetchRoles();
  }, []);

  if (!isOpen) return null;

  const initialValues = {
    firstname: user?.firstName || "",
    lastname: user?.lastName || "",
    email: user?.email || "",
    password: "",
    cpassword: "",
    role: user?.role || "",
  };
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    console.log("FORM SUBMITTED", values, mode);
    try {
      if (mode === "add") {
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          values.email,
          values.password,
        );

        const newUser = userCredential.user;

        await setDoc(doc(db, "users", newUser.uid), {
          email: values.email,
          firstName: values.firstname,
          lastName: values.lastname,
          role: values.role,
          createdAt: serverTimestamp(),
        });
        toast.success("User Created");

        onSave?.({
          id: newUser.uid,
          email: values.email,
          firstName: values.firstname,
          lastName: values.lastname,
          role: values.role,
        });
      }
      if (mode === "edit" && user?.id) {
        const updatedUser: User = {
          id: user.id,
          email: values.email,
          firstName: values.firstname,
          lastName: values.lastname,
          role: values.role,
          createdAt: user.createdAt,
        };
        await updateDoc(doc(db, "users", user.id), updatedUser);

        onSave?.(updatedUser);

        toast.success("User Updated");
      }

      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      {...rest}
    >
      <div
        className=" relative bg-white p-6 rounded-lg shadow-lg w-105"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <div className="text-xl font-bold mb-4">
          {mode === "add" ? "Add User" : "Edit User"}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={mode === "add" ? signupSchema : undefined}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form className="flex flex-col gap-4">
              <FormField
                id="firstname"
                name="firstname"
                label="First Name"
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstname}
                touched={touched.firstname}
              />

              <FormField
                id="lastname"
                name="lastname"
                label="Last Name"
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastname}
                touched={touched.lastname}
              />

              <FormField
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />

              {mode === "add" && (
                <>
                  <FormField
                    id="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                  />

                  <FormField
                    id="cpassword"
                    label="Confirm Password"
                    type="password"
                    value={values.cpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.cpassword}
                    touched={touched.cpassword}
                  />
                </>
              )}
              <div>
                <label className="text-sm text-gray-600">Role</label>

                <select
                  value={values.role}
                  onChange={(e) => setFieldValue("role", e.target.value)}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="">Select Role</option>

                  {roles
                    .filter((role) => role.toLowerCase() !== "admin")
                    .map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                </select>

                {touched.role && errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {mode === "add" ? "Add User" : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CommonModal;
