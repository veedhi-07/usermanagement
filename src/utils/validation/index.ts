import * as Yup from "yup";

export const signupSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),

  lastname: Yup.string()
    .required("Last name is required")
    .test("not-same", "First and last name cannot be same", function (value) {
      return value !== this.parent.firstname;
    }),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .matches(/[A-Za-z]/, "Password must contain an alphabet")
    .matches(/\d/, "Password must contain a number")
    .matches(/[@$!%*#?&]/, "Password must contain a special character"),

  cpassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password do not match!")
    .required("Please enter confirm password."),
});

export const editUserSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),

  lastname: Yup.string()
    .required("Last name is required")
    .test("not-same", "First and last name cannot be same", function (value) {
      return value !== this.parent.firstname;
    }),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .matches(/[A-Za-z]/, "Password must contain an alphabet")
    .matches(/\d/, "Password must contain a number")
    .matches(/[@$!%*#?&]/, "Password must contain a special character"),
});

export const profileSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .nullable()
    .notRequired(),
});
