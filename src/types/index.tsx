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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
    };
  };
}
export interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  roleid?: number;
  roleTitle: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileValues {
  id?: string;
  email?: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  roleid?: number;
  // roleTitle: string;
  // isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
