//input-field
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
//pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalCount?: number;
  label?: string;
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

//use-permission hook
export type ActionKey = "view" | "list" | "add" | "edit" | "delete";

//permission-slice
export type PermissionsState = Record<string, ModulePermission>;
export type Permission = {
  moduleSlug: string;
  list: boolean;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
};

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,
}
