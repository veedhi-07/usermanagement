import { Timestamp } from "firebase/firestore";
import type { ReactNode } from "react";
import type { ModuleKey, ActionKey } from "../redux/reducer/permission-slice";

export interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: Timestamp;
}
export interface Role {
  id: string;
  name: string;
  permissions: Permissions;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}
export interface ButtonProps {
  type?: "submit" | "reset" | "button";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  success?: boolean;
  children: ReactNode;
}
export interface conversation {
  id: string;
  type: "private" | "group";
  createdAt: Timestamp;
  participants?: string[];
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  senderId?: string;
  createdBy?: string;
  text?: string;
  name?: string;
}
export interface PaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}
export interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface NavProps {
  onMenuClick: () => void;
}

export interface Message {
  id?: string;
  text: string;
  senderId: string;
  type: string;
  createdAt: Timestamp;
  seenBy: string[];
}

export interface ModalProps {
  className?: string;
  disabled?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onSubmit?: () => void;
  user?: User;
  onSave?: (user: User) => void;
  mode?: "add" | "edit";
}
export interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}
export interface ForgotPasswordModalProps {
  isOpen?: boolean;
  onClose: () => void;
}
//profileslice
export interface ProfileState {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}
//permissionslice
export interface ModulePermission {
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}
// permissionslice
export interface PermissionsState {
  campaign?: ModulePermission;
  chat?: ModulePermission;
  user?: ModulePermission;
  role?: ModulePermission;
}
export type Module = "user" | "chat" | "role" | "campaign";
export type Action = "view" | "add" | "edit" | "delete";

export type Permissions = Record<Module, Record<Action, boolean>>;
//formfield
export interface FormProps {
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
}

//can
export interface CanProps {
  module: ModuleKey;
  action: ActionKey;
  children: ReactNode;
}
