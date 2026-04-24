import { SignInFormValues, SignUpformValues, ProfileValues } from "../../types";

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

export const AddEditFields: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter your First Name",
    type: "text",
  },
  {
    id: "lastName",
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
    id: "phone",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "string",
  },
  {
    id: "isActive",
    label: "Status",
    placeholder: "Select Status",
    type: "select",
  },
  {
    id: "roleid",
    label: "Role",
    placeholder: "Select Role",
    type: "select",
  },
];

export const ProfileFields: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter your First Name",
    type: "text",
  },
  {
    id: "lastName",
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
    id: "phone",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "string",
  },
];
export const signUpFields: {
  id: keyof SignUpformValues;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter your First Name",
    type: "text",
  },
  {
    id: "lastName",
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
    id: "username",
    label: "User Name",
    placeholder: "Enter UserName",
    type: "text",
  },
  {
    id: "phone",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "string",
  },
];
