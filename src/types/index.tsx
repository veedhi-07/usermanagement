export interface FormProps {
  id?: string;
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  touched?: boolean;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
  success?: string;
  hint?: string;
}
export interface SignInFormValues {
  email: string;
  password: string;
}

export interface SignUpformValues {
  fname: string;
  lname: string;
  email: string;
  password: string;
  uname: string;
  phone: string;
}
