import { apiClient } from "../../../../lib/apiclient";
import { Role } from "../../../../types";
import { endpoints } from "../../../../lib/endpoints";

export const getRolesApi = async (): Promise<Role[]> => {
  const res = await apiClient.get(endpoints.roles);
  return res.data.roles;
};

export const getroleByIdApi = async (id: number) => {
  const res = await apiClient.get(`${endpoints.roles}/${id}`);
  // console.log("RAW API:", res.data);
  return res.data;
};

export const createRoleApi = async (data: Partial<Role>) => {
  const res = await apiClient.post(endpoints.roles, data);
  return res.data;
};

export const updateRoleApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Role>;
}) => {
  const res = await apiClient.put(`${endpoints.roles}/${id}`, data);
  return res.data;
};

export const deleteRoleApi = async (id: number) => {
  const res = await apiClient.delete(`${endpoints.roles}/${id}`);
  return res.data;
};
