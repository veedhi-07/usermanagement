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
export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  };
}
export interface UserMutationResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
export enum Status{
  isActive
}
