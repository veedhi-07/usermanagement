import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import formField from "../../form/input/InputField";
import "react-phone-input-2/lib/style.css";
import Label from "../../form/Label";
import { Formik, Form } from "formik";
import toast from "react-hot-toast";
import { User } from "../../../types";
import { profileSchema } from "../../../utils/validation";
import { AddEditFields } from "../../../components/input-config";
import { useUser } from "../../../features/users/hooks/useuser-hook";
import PhoneInput from "react-phone-input-2";
import FormField from "../../form/input/InputField";
import { useRole } from "../../../features/roles/hooks/userole-hook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}
export default function AddEditModal({ isOpen, onClose, user }: Props) {
  const { roles } = useRole();
  const { updateUser, createUser } = useUser();

  const filteredRoles =
    roles?.filter((role: any) => role.title.toLowerCase() !== "admin") || [];

  const getError = (error: any) =>
    typeof error === "string" ? error : undefined;
  const isEditMode = !!user;
  const initialValues = {
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    phone: user?.phone || "",
    isActive: user?.isActive ?? true,
    roleid: user?.roleid ?? undefined,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175 m-4">
      <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {user ? "Edit User" : "Add User"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={profileSchema}
          // onSubmit={async (values, { setSubmitting }) => {
          //   console.log("SUBMIT:", values);

          //   try {
          //     const cleanPayload: Partial<User> = {
          //       email: values.email,
          //       firstName: values.firstName,
          //       lastName: values.lastName,
          //       username: values.username,
          //       phone: values.phone,
          //       isActive: values.isActive,
          //       roleid: values.roleid,
          //     };
          //     console.log("CALLING API...");

          //     const res = await updateUser.mutateAsync({
          //       id: Number(user!.id),
          //       data: cleanPayload,
          //     });

          //     console.log("API RESPONSE:", res);

          //     toast.success("Profile updated successfully", {
          //       duration: 3000,
          //     });
          //     setTimeout(() => {
          //       onClose();
          //     }, 500);
          //   } catch (err: any) {
          //     console.log("API ERROR:", err?.response?.data);

          //     toast.error(err?.response?.data?.message || "Update failed");
          //   } finally {
          //     setSubmitting(false);
          //   }
          // }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const cleanPayload: Partial<User> = {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                phone: values.phone,
                isActive: values.isActive,
                roleid: values.roleid,
              };

              if (isEditMode) {
                // EDIT USER
                await updateUser.mutateAsync({
                  id: Number(user!.id),
                  data: cleanPayload,
                });

                toast.success("User updated successfully");
              } else {
                // ADD USER
                await createUser.mutateAsync(cleanPayload);

                toast.success("User created successfully");
              }

              onClose();
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Operation failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="flex flex-col">
              <div className="custom-scrollbar h-112.5 overflow-y-auto px-2 pb-3">
                <div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2"></div>
                </div>
                <div className="mt-7">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    {AddEditFields.map((field) => {
                      const isisActiveField = field.id === "isActive";
                      const isPhone = field.id === "phone";
                      const isRole = field.id === "roleid";
                      return (
                        <div
                          key={field.id}
                          className="col-span-2 lg:col-span-1"
                        >
                          <Label>{field.label}</Label>

                          {isisActiveField ? (
                            <select
                              name="isActive"
                              value={values.isActive ? "true" : "false"}
                              onChange={(e) => {
                                handleChange({
                                  target: {
                                    name: "isActive",
                                    value: e.target.value === "true",
                                  },
                                } as any);
                              }}
                              onBlur={handleBlur}
                              className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          ) : isPhone ? (
                            <>
                              <PhoneInput
                                country={"in"} // default India
                                value={values.phone}
                                onChange={(phone) =>
                                  setFieldValue("phone", phone)
                                }
                                onBlur={() => setFieldTouched("phone", true)}
                                inputStyle={{
                                  width: "100%",
                                  height: "40px",
                                }}
                              />

                              {/* Error */}
                              {touched.phone && errors.phone && (
                                <p className="text-error-500 text-sm mt-1">
                                  {errors.phone}
                                </p>
                              )}
                            </>
                          ) : isRole ? (
                            // ROLE DROPDOWN FIX
                            <select
                              name="roleid"
                              value={values.roleid}
                              onChange={(e) =>
                                setFieldValue("roleid", Number(e.target.value))
                              }
                              onBlur={handleBlur}
                              className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
                            >
                              <option value="">Select Role</option>

                              {filteredRoles.map((role: any) => (
                                <option key={role.id} value={role.id}>
                                  {role.title}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <FormField
                              type={field.type}
                              name={field.id}
                              value={
                                values[
                                  field.id as keyof typeof values
                                ] as string
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                !!(
                                  touched[field.id as keyof typeof values] &&
                                  errors[field.id as keyof typeof values]
                                )
                              }
                            />
                          )}

                          {touched[field.id as keyof typeof values] &&
                            errors[field.id as keyof typeof values] && (
                              <p className="text-red-500 text-sm mt-1">
                                {getError(
                                  errors[field.id as keyof typeof values],
                                )}
                              </p>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  variant="primary"
                  disabled={updateUser.isPending || isSubmitting}
                >
                  {updateUser.isPending || isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
