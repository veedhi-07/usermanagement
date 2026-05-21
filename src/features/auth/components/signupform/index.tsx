import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../../../assets/icons";
import Label from "../../../../components/form/label/index";
// import { Formik, Form } from "formik";
import { useForm } from "react-hook-form";
// import { signupSchema } from "../../../../utils/validation";
import { signUpSchema, SignUpFormValues } from "../../../../utils/zvalidation";
import FormField from "../../../../components/form/input/form-field";
// import { SignUpformValues } from "../../types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFields } from "../../../../components/input-config";
import { useSignUp } from "../../hooks/useauth-hook";
import Button from "../../../../components/ui/button/index";
// import { SignUpformValues } from "../../types";

export default function SignUpForm() {
  // const initialValues = {
  //   email: "",
  //   password: "",
  //   firstName: "",
  //   lastName: "",
  //   username: "",
  //   confirmPassword: "",
  //   phone: "",
  // };
  const [showPassword, setShowPassword] = useState(false);
  const { mutate } = useSignUp();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    mutate(values);
  };
  return (
    <div className="flex flex-col flex-1 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1
              className="
                mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
            >
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {signUpFields.map((field) => {
                const isPassword =
                  field.id === "password" || field.id === "confirmPassword";
                const isFullWidth = !isPassword;
                const isPhone = field.id === "phone";

                return (
                  <div
                    key={field.id}
                    className={`
                        ${isFullWidth ? "col-span-2" : "col-span-1"}
                        ${isPassword ? "relative" : ""}
                      `}
                  >
                    <Label>
                      {field.label}
                      <span className="text-error-500">*</span>
                    </Label>

                    {isPhone ? (
                      <>
                        <PhoneInput
                          country={"in"}
                          value={watch("phone")}
                          inputStyle={{
                            width: "100%",
                            height: "40px",
                          }}
                        />

                        {/* Error */}
                        {errors.phone && (
                          <p className="text-error-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <FormField
                          id={field.id}
                          placeholder={field.placeholder}
                          type={
                            isPassword
                              ? showPassword
                                ? "text"
                                : "password"
                              : field.type
                          }
                          error={!!errors[field.id]}
                          errorMessage={errors[field.id]?.message}
                          {...register(field.id)}
                        />
                        {/* Password Toggle */}
                        {isPassword && (
                          <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-10.5 -translate-y-1/2 cursor-pointer z-30"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              <div className="col-span-2">
                <Button type="submit" className="w-full" size="sm">
                  Sign up
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
