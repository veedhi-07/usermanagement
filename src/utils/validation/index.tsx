import * as Yup from "yup";

export const signupSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),

  lastName: Yup.string()
    .required("Last Name is required")
    .test("not-same", "First and last Name cannot be same", function (value) {
      return value !== this.parent.firstname;
    }),

  username: Yup.string().required("User Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters")
    .matches(/[A-Za-z]/, "Password must contain an alphabet")
    .matches(/\d/, "Password must contain a number")
    .matches(/[@$!%*#?&]/, "Password must contain a special character"),

  phone: Yup.string()
    .required("Phone is required")
    .test("valid-phone", "Enter valid phone number", (value) => {
      if (!value) return false;

      // remove country code (simple approach) if not digit replace it
      const phoneDigits = value.replace(/\D/g, "");

      return phoneDigits.length >= 10;
    }),
});

export const signinSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Za-z]/, "Password must contain an alphabet")
    .matches(/\d/, "Password must contain a number")
    .matches(/[@$!%*#?&]/, "Password must contain a special character"),
});

//edit profile schema
export const profileSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),

  lastName: Yup.string()
    .required("Last Name is required")
    .test("not-same", "First and last Name cannot be same", function (value) {
      return value !== this.parent.firstname;
    }),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone is required")
    .test("valid-phone", "Enter valid phone number", (value) => {
      if (!value) return false;

      // remove country code (simple approach) if not digit replace it
      const phoneDigits = value.replace(/\D/g, "");

      return phoneDigits.length >= 10;
    }),
});
