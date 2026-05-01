export interface Role {
  id: number;
  title: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface GetRolesResponse {
  success: boolean;
  data: {
    roles: Role[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  };
}

export interface RoleMutationResponse {
  success: boolean;
  message: string;
  data: {
    role: Role;
  };
}
export interface DeleteRoleResponse {
  success: boolean;
  message: string;
}
