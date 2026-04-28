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
  id: number;
  email?: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  roleId?: number;
  roleTitle: string;
  isActive: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  title: string;
  status: "active" | "inactive";
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
  roleId?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}
//permissionslice
export type ModulePermission = {
  moduleSlug: string;
  list: number;
  view: number;
  add: number;
  edit: number;
  delete: number;
};

export type Module = "user" | "role";
export type ActionKey = "view" | "list" | "add" | "edit" | "delete";

export type PermissionsState = Record<string, ModulePermission>;

export type RolePermission = {
  roleId: number;
  permissionId: number;
};

