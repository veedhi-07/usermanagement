import type { FC } from "react";
import { Formik, Form } from "formik";
import FormField from "../../components/common/form-field/formfield";
import Button from "../common/button";
import { useCallback } from "react";
import { signupSchema, editUserSchema } from "../../utils/validation";
import { secondaryAuth } from "../../services/firebase";
import type { User } from "../../../src/types/index";
import { Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import type { FormikHelpers } from "formik";
import CommonModall from "../common/common-modal";
import { usefirebasecollection } from "../../hooks/use-firebasecollection/usefirebasecollection";
import type { Role, ModalProps } from "../../types/index";
import { usersService } from "../../services/firebase/users-service";
const UserModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  user,
  mode = "add",
  onSave,
}) => {
  const { data: roles } = usefirebasecollection<Role>("roles");
  const initialValues = {
    firstname: user?.firstName || "",
    lastname: user?.lastName || "",
    email: user?.email || "",
    password: "",
    cpassword: "",
    role: user?.role || "",
  };

  const handleSubmit = useCallback(
    async (
      values: typeof initialValues,
      { setSubmitting }: FormikHelpers<typeof initialValues>,
    ) => {
      try {
        if (mode === "add") {
          const userCredential = await createUserWithEmailAndPassword(
            secondaryAuth,
            values.email,
            values.password,
          );

          const newUser = userCredential.user;

          await usersService.create({
            email: values.email,
            firstName: values.firstname,
            lastName: values.lastname,
            role: values.role,
            createdAt: Timestamp.now(),
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

          await usersService.update(user.id, {
            email: values.email,
            firstName: values.firstname,
            lastName: values.lastname,
            role: values.role,
          });

          toast.success("User Updated");

          onSave?.(updatedUser);
        }

        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
    [mode, user, onSave, onClose],
  );

  return (
    <CommonModall
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add User" : "Edit User"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={mode === "add" ? signupSchema : editUserSchema}
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
                  name="password"
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
                  name="cpassword"
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
                  .filter((role) => role.name.toLowerCase() !== "admin")
                  .map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
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
    </CommonModall>
  );
};

export default UserModal;
