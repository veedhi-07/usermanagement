import { useModal } from "../../../../hooks/use-modal/index";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/index";
import Label from "../../../form/label";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useProfile } from "./../../hook/profile-hook";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { ProfileFields } from "../../../input-config";
import { profileSchema } from "../../../../utils/validation";
import FormField from "../../../form/input/input-field";

export default function UserInfoCard() {
  const { UpdateProfile } = useProfile();
  const { isOpen, openModal, closeModal } = useModal();

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const getError = (error: any) =>
    typeof error === "string" ? error : undefined;
  const initialValues = {
    email: user.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    phone: user?.phone || "",
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p>{user?.firstName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p>{user?.lastName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p>{user?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                User Name
              </p>
              <p>{user?.username}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p>{user?.phone}</p>
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={profileSchema}
            onSubmit={async (values, { setSubmitting }) => {
              console.log("SUBMIT:", values);

              try {
                const cleanPayload = {
                  ...values,
                  password: undefined,
                };

                const res = await UpdateProfile.mutateAsync(cleanPayload);
                console.log("API RESPONSE:", res);

                const updatedUser = {
                  ...user,
                  ...values,
                  ...(res?.user || res?.data?.user || {}),
                };

                setUser({ ...updatedUser });
                localStorage.setItem("user", JSON.stringify(updatedUser));

                toast.success("Profile updated successfully", {
                  duration: 3000,
                });
                setTimeout(() => {
                  closeModal();
                }, 500);
              } catch (err: any) {
                console.log("API ERROR:", err?.response?.data);

                toast.error(err?.response?.data?.message || "Update failed");
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
              setFieldValue,
              setFieldTouched,
              touched,
            }) => (
              <Form className="flex flex-col">
                <div className="custom-scrollbar h-112.5 overflow-y-auto px-2 pb-3">
                  <div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2"></div>
                  </div>
                  <div className="mt-7">
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Personal Information
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      {ProfileFields.map((field) => {
                        const isPhone = field.id === "phone";
                        return (
                          <div
                            key={field.id}
                            className="col-span-2 lg:col-span-1"
                          >
                            <Label>{field.label}</Label>

                            {isPhone ? (
                              <>
                                <PhoneInput
                                  country={"in"}
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
                                {touched.phone && errors.phone === "string" && (
                                  <p className="text-error-500 text-sm mt-1">
                                    {errors.phone}
                                  </p>
                                )}
                                {/* {isPhone &&
                                  typeof errors.phone === "string" && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {errors.phone}
                                    </p>
                                  )} */}
                              </>
                            ) : (
                              <FormField
                                type={field.type}
                                name={field.id}
                                value={values[field.id as keyof typeof values]}
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
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    variant="primary"
                    disabled={UpdateProfile.isPending}
                  >
                    {UpdateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
