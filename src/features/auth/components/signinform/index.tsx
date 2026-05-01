import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../../../assets/icons";
import FormField from "../../../../components/form/input/input-field";
import { Formik, Form } from "formik";
import { signinSchema } from "../../../../utils/validation";
import { signInFields } from "../../../../components/input-config";
import Button from "../../../../components/ui/button/index";
import Label from "../../../../components/form/label/index";
import { SignInFormValues } from "../../types";
import { useSignIn } from "../../hooks/useauth-hook";

export default function SignInForm() {
  const initialValues = { email: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useSignIn();
  return (
    <Formik<SignInFormValues>
      initialValues={initialValues}
      onSubmit={(values) => {
        // console.log("FORM SUBMIT TRIGGERED", values);
        mutate(values);
      }}
      validationSchema={signinSchema}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <div className="flex flex-col flex-1 no-scrollbar">
          <div className="w-full max-w-md pt-10 mx-auto"></div>

          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                <Form>
                  <div className="space-y-6">
                    {signInFields.map((field) => {
                      const isPassword = field.id === "password";
                      return (
                        <div key={field.id}>
                          <Label>
                            {field.label}
                            <span className="text-error-500">*</span>
                          </Label>

                          <div className="relative">
                            <FormField
                              id={field.id}
                              label={field.label}
                              placeholder={field.placeholder}
                              value={values[field.id]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!(touched[field.id] && errors[field.id])}
                              errorMessage={
                                touched[field.id]
                                  ? (errors as any)[field.id]
                                  : ""
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

                            {isPassword && (
                              <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-[22px] -translate-y-1/2 cursor-pointer z-30"
                              >
                                {showPassword ? (
                                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                                ) : (
                                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                        size="sm"
                      >
                        {isPending ? "Signing in ..." : "Sign In"}
                      </Button>
                    </div>
                  </div>
                </Form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Don&apos;t have an account? {""}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}
