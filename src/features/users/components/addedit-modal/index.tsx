import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button";
import { EyeCloseIcon, EyeIcon } from "../../../../assets/icons";
import "react-phone-input-2/lib/style.css";
import Label from "../../../../components/form/label";
import toast from "react-hot-toast";
import { User } from "../../../users/types";
import { Role } from "../../../roles/types";
import { AddEditFields } from "../../../../components/input-config";
import { useUser } from "../../hooks/useuser-hook";
import PhoneInput from "react-phone-input-2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { AddEditSchema, AddEditValues } from "../../../../utils/zvalidation";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Select from "../../../../components/form/select";
import FormField from "../../../../components/form/input/form-field";
import { useRole } from "../../../../features/roles/hooks/userole-hook";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function AddEditModal({ isOpen, onClose, user }: Props) {
  const { roles } = useRole();

  const { updateUser, createUser } = useUser();

  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!user;

  const filteredRoles =
    roles?.filter((role: Role) => role.title.toLowerCase() !== "super admin") ||
    [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddEditValues>({
    resolver: zodResolver(AddEditSchema),

    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      password: "",
      isActive: true,
      roleId: undefined,
    },
  });

  // Persist data
  useEffect(() => {
    reset({
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      phone: user?.phone || "",
      password: "",
      isActive: user?.isActive ?? true,
      roleId: user?.roleId ?? undefined,
    });
  }, [user, reset]);

  const onSubmit = async (values: AddEditValues) => {
    try {
      // password required only while creating user
      if (!isEditMode && !values.password?.trim()) {
        toast.error("Password is required");

        return;
      }

      const cleanPayload: Partial<User> = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        phone: values.phone,
        isActive: values.isActive,
        roleId: values.roleId,
      };

      // EDIT USER
      if (isEditMode) {
        if (values.password?.trim()) {
          cleanPayload.password = values.password;
        }

        await updateUser.mutateAsync({
          id: Number(user!.id),
          data: cleanPayload,
        });

        toast.success("User updated successfully");
      }

      // CREATE USER
      else {
        cleanPayload.password = values.password;

        await createUser.mutateAsync(cleanPayload);

        toast.success("User created successfully");
      }

      onClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Operation failed");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175">
      <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Edit User" : "Add User"}
          </h4>

          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col"
          autoComplete="off"
        >
          <div className="px-2 pb-3">
            <div className="mt-7">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {AddEditFields.filter((field) => {
                  if (isEditMode) {
                    return field.showInEdit !== false;
                  }

                  return true;
                }).map((field) => {
                  const isActiveField = field.id === "isActive";

                  const isPhone = field.id === "phone";

                  const isPassword = field.id === "password";

                  const isRole = field.id === "roleId";

                  return (
                    <div key={field.id} className="col-span-2 lg:col-span-1">
                      <Label>{field.label}</Label>

                      {/* ACTIVE STATUS */}
                      {isActiveField ? (
                        <>
                          <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value ? "true" : "false"}
                                onChange={(value) =>
                                  field.onChange(value === "true")
                                }
                                options={[
                                  {
                                    value: "true",
                                    label: "Active",
                                  },
                                  {
                                    value: "false",
                                    label: "Inactive",
                                  },
                                ]}
                                placeholder="Select Status"
                              />
                            )}
                          />

                          {errors.isActive && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.isActive.message}
                            </p>
                          )}
                        </>
                      ) : isPhone ? (
                        <>
                          {/* PHONE */}
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <PhoneInput
                                country={"in"}
                                value={field.value}
                                onChange={field.onChange}
                                inputStyle={{
                                  width: "100%",
                                  height: "44px",
                                }}
                              />
                            )}
                          />

                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </>
                      ) : isRole ? (
                        <>
                          {/* ROLE */}
                          <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value ? String(field.value) : ""}
                                onChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                options={[
                                  {
                                    value: "",
                                    label: "Select Role",
                                  },

                                  ...filteredRoles.map((role: Role) => ({
                                    value: String(role.id),
                                    label: role.title,
                                  })),
                                ]}
                                placeholder="Select Role"
                              />
                            )}
                          />
                          {errors.roleId && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.roleId.message}
                            </p>
                          )}
                        </>
                      ) : isPassword ? (
                        <>
                          {/* PASSWORD */}
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              className="h-11 w-full rounded-lg border px-4 py-2.5 pr-10 text-sm outline-hidden dark:text-white/90"
                              {...register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                              ) : (
                                <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                              )}
                            </button>
                          </div>

                          {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.password.message}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Normal Inputs */}
                          <FormField
                            type={field.type}
                            placeholder={field.placeholder}
                            error={!!errors[field.id as keyof AddEditValues]}
                            {...register(field.id as keyof AddEditValues)}
                          />

                          {errors[field.id as keyof AddEditValues] && (
                            <p className="mt-1 text-sm text-red-500">
                              {
                                errors[field.id as keyof AddEditValues]
                                  ?.message as string
                              }
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button type="button" size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>

            <Button
              size="sm"
              type="submit"
              variant="primary"
              disabled={
                updateUser.isPending || createUser.isPending || isSubmitting
              }
            >
              {updateUser.isPending || createUser.isPending || isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
