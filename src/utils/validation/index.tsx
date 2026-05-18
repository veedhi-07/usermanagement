import * as Yup from "yup";
//signup schema
export const signupSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),

  lastName: Yup.string()
    .required("Last Name is required")
    .test("not-same", "First and last Name cannot be same", function (value) {
      return value !== this.parent.firstName;
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

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),

  phone: Yup.string()
    .required("Phone is required")
    .test("valid-phone", "Enter valid phone number", (value) => {
      if (!value) return false;

      const phoneDigits = value.replace(/\D/g, "");

      return phoneDigits.length >= 10;
    }),
});

//signin schema
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
      return value !== this.parent.firstName;
    }),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  phone: Yup.string()
    .required("Phone is required")
    .test("valid-phone", "Enter valid phone number", (value) => {
      if (!value) return false;
      const phoneDigits = value.replace(/\D/g, "");
      return phoneDigits.length >= 10;
    }),
});

//add-edit modal schema
export const AddEditSchema = (isEditMode: boolean, resetPassword: boolean) =>
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),

    lastName: Yup.string()
      .required("Last Name is required")
      .test("not-same", "First and last Name cannot be same", function (value) {
        return value !== this.parent.firstName;
      }),

    username: Yup.string().required("User Name is required"),

    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),

    phone: Yup.string()
      .required("Phone is required")
      .test("valid-phone", "Enter valid phone number", (value) => {
        if (!value) return false;

        const phoneDigits = value.replace(/\D/g, "");

        return phoneDigits.length >= 10;
      }),

    password: Yup.string().when([], {
      is: () => !isEditMode || resetPassword,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(5, "Password must be at least 5 characters")
          .matches(/[A-Za-z]/, "Password must contain an alphabet")
          .matches(/\d/, "Password must contain a number")
          .matches(/[@$!%*#?&]/, "Password must contain a special character"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
//add-edit modal schema
// export const AddEditBaseSchema = z.object({
//   firstName: z.string().min(1, "Firstname is required"),

//   lastName: z.string().min(1, "Lastname is required"),

//   email: z.string().min(1, "Email is required").email("Enter a valid email"),

//   phone: z
//     .string()
//     .min(1, "Phone is required")
//     .refine((value) => {
//       const phoneDigits = value.replace(/\D/g, "");
//       return phoneDigits.length >= 10;
//     }),

//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(8, "Password must be atleast 8 characters")
//     .regex(/[A-Za-z]/, "Password must contain an alphabet")
//     .regex(/\d/, "Password must contain a number")
//     .regex(/[@$!#%&*?]/, "Password must contain a special character")
//     .optional(),

//   isActive: z.boolean(),

//   // roleId: z.number({
//   //   required_error: "Role is required",
//   // })
// });
// export type AddEditValues = z.infer<typeof AddEditBaseSchema>;