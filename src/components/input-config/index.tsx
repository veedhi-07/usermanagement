import { SignInFormValues, SignUpformValues } from "../../features/auth/types";

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
  showInEdit: boolean;
  type: string;
}[] = [
  {
    id: "firstName",
    label: "First Name",
    placeholder: "Enter your First Name",
    type: "text",
    showInEdit: true,
  },
  {
    id: "lastName",
    label: "Last Name",
    placeholder: "Enter your Last Name",
    type: "text",
    showInEdit: true,
  },
  {
    id: "email",
    label: "Email",
    placeholder: "name@email.com",
    type: "text",
    showInEdit: true,
  },
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your User Name ",
    showInEdit: true,
  },

  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter Password",
    showInEdit: true,
  },

  {
    id: "phone",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "string",
    showInEdit: true,
  },
  {
    id: "isActive",
    label: "Status",
    placeholder: "Select Status",
    type: "select",
    showInEdit: true,
  },
  {
    id: "roleId",
    label: "Role",
    placeholder: "Select Role",
    type: "select",
    showInEdit: true,
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
  autocomplete?: string;
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
    // autocomplete: "section-signup email",
  },
  {
    id: "password",
    label: "Password",
    placeholder: "Enter Password",
    type: "password",
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter Password",
    type: "password",
  },
  {
    id: "username",
    label: "User Name",
    placeholder: "Enter your User Name",
    type: "text",
    // autocomplete: "section-signup username",
  },
  {
    id: "phone",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "number",
  },
];
