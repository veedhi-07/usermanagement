import { z } from "zod";
//Signin schema
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be atleast 8 characters")
    .regex(/[A-Za-z]/, "Password must contain an alphabet")
    .regex(/\d/, "Password must contain a number")
    .regex(/[@$!#%&*?]/, "Password must contain a special character"),
});
export type SignInFormValues = z.infer<typeof signInSchema>;
//signup schema
export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "Firstname is required"),

    lastName: z.string().min(1, "Lastname is required"),

    username: z.string().min(1, "Username is required"),

    email: z.string().min(1, "Email is required").email("Enter a valid email"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be atleast 8 characters")
      .regex(/[A-Za-z]/, "Password must contain an alphabet")
      .regex(/\d/, "Password must contain a number")
      .regex(/[@$!#%&*?]/, "Password must contain a special character"),

    confirmPassword: z.string().min(1, "ConfirmPassword is required"),

    phone: z
      .string()
      .min(1, "Phone is required")
      .refine((value) => {
        const phoneDigits = value.replace(/\D/g, "");
        return phoneDigits.length >= 10;
      }),
  })
  .refine((data) => data.firstName !== data.lastName, {
    message: "Firstname and Lastname cannot be the same",
    path: ["lastName"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and ConfirmPassword must be same",
    path: ["confirmPassword"],
  });
export type SignUpFormValues = z.infer<typeof signUpSchema>;

//edit profile schema
export const profileSchema = z
  .object({
    firstName: z.string().min(1, "Firstname is required"),

    lastName: z.string().min(1, "Lastname is required"),

    email: z.string().min(1, "Email is required").email("Enter a valid email"),

    phone: z
      .string()
      .min(1, "Phone is required")
      .refine((value) => {
        const phoneDigits = value.replace(/\D/g, "");
        return phoneDigits.length >= 10;
      }),
  })
  .refine((data) => data.firstName !== data.lastName, {
    message: "Firstname and Lastname cannot be the same",
    path: ["lastName"],
  });

  //add-edit modal schema
  export const AddEditSchema = (isEditMode: boolean, resetPassword:boolean) => 
    z.object({

    })