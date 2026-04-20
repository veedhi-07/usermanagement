import { SignInFormValues, SignUpformValues } from "../../types";

export const signInFields: {
  id: keyof SignInFormValues;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    id: "email",
    label: "Email",
    placeholder: "name@email.com",
    type: "text",
  },
  {
    id: "password",
    label: "Password",
    placeholder: "Enter Password",
    type: "password",
  },
];
export const signUpFields: {
  id: keyof SignUpformValues;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    id: "fname",
    label: "First Name",
    placeholder: "Enter your First Name",
    type: "text",
  },
  {
    id: "lname",
    label: "Last Name",
    placeholder: "Enter your Last Name",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    placeholder: "name@email.com",
    type: "text",
  },
  {
    id: "password",
    label: "Password",
    placeholder: "Enter Password",
    type: "password",
  },
  {
    id: "uname",
    label: "User Name",
    placeholder: "Enter UserName",
    type: "text",
  },
    {
      id: "phone",
      label: "Phone Number",
      placeholder: "Enter Phone Number",
      type: "phone",
    },
];
