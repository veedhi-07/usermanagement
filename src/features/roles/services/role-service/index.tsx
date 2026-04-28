import { apiClient } from "../../../../lib/apiclient";
import { Role } from "../../../../types";


export const getRolesApi = async (): Promise<Role[]> => {
  const res = await apiClient.get("/roles");
  return res.data.roles;
};


export const getroleByIdApi = async (id: number) => {
  const res = await apiClient.get(`/roles/${id}`);
  console.log("RAW API:", res.data);
  return res.data;
};


export const createRoleApi = async (data: Partial<Role>) => {
  const res = await apiClient.post("/roles", data);
  return res.data;
};


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


export const deleteRoleApi = async (id: number) => {
  const res = await apiClient.delete(`/roles/${id}`);
  return res.data;
};
