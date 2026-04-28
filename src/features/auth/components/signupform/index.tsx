import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronLeftIcon,
  EyeCloseIcon,
  EyeIcon,
} from "../../../../assets/icons";
import Label from "../../../../components/form/label/index";
import { Formik, Form } from "formik";
import { signupSchema } from "../../../../utils/validation";
import FormField from "../../../../components/form/input/input-field";
import { SignUpformValues } from "../../../../types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signUpFields } from "../../../../components/input-config";
import { useSignUp } from "../../hooks/useauth-hook";
import Button from "../../../../components/ui/button/index";

export default function SignUpForm() {
  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const { mutate } = useSignUp();

  return (
    <Formik<SignUpformValues>
      initialValues={initialValues}
      validationSchema={signupSchema}
      onSubmit={(values) => {
        console.log("Signup form data", values);
        mutate(values);
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon className="size-5" />
              Back to dashboard
            </Link>
          </div>

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
              <Form>
                <div className="space-y-5">
                  {signUpFields.map((field) => {
                    const isPassword = field.id === "password";
                    const isPhone = field.type === "phone";

                    return (
                      <div
                        key={field.id}
                        className={isPassword ? "relative" : ""}
                      >
                        <Label>
                          {field.label}
                          <span className="text-error-500">*</span>
                        </Label>

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
                            {touched.phone && errors.phone && (
                              <p className="text-error-500 text-sm mt-1">
                                {errors.phone}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <FormField
                              id={field.id}
                              placeholder={field.placeholder}
                              value={values[field.id]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!(touched[field.id] && errors[field.id])}
                              errorMessage={
                                touched[field.id] ? errors[field.id] : ""
                              }
                              touched={touched[field.id]}
                              type={
                                isPassword
                                  ? showPassword
                                    ? "text"
                                    : "password"
                                  : field.type
                              }
                            />
                            {/* Password Toggle */}
                            {isPassword && (
                              <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
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
                  <Button type="submit" className="w-full" size="sm">
                    Sign up
                  </Button>
                </div>
              </Form>
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
      )}
    </Formik>
  );
}
