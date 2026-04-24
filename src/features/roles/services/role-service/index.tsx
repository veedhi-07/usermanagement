import { apiClient } from "../../../../lib/apiclient";
import { Role } from "../../../../types";

// GET ALL USERS
export const getRolesApi = async (): Promise<Role[]> => {
  const res = await apiClient.get("/roles");
  return res.data.roles;
};

//GET SINGLE ROLE
export const getroleByIdApi = async (id: number): Promise<Role> => {
  const res = await apiClient.get(`/roles/${id}`);
  return res.data.role;
};

//  CREATE ROLE
export const createRoleApi = async (data: Partial<Role>) => {
  const res = await apiClient.post("/roles", data);
  return res.data;
};

//  UPDATE ROLE
export const updateRoleApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Role>;
}) => {
  const res = await apiClient.put(`/roles/${id}`, data);
  return res.data;
};

// DELETE ROLE
export const deleteRoleApi = async (id: number) => {
  const res = await apiClient.delete(`/roles/${id}`);
  return res.data;
};
