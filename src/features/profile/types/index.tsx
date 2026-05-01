import { User } from "../../users/types";

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

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}
