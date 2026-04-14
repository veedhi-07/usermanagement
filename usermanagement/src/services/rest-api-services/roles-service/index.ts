import { apiClient } from "../../../api/apiclient";
import { endpoints } from "../../../api/endpoints";
import type { Roles } from "../../../types";
export const roleApi = {
  getRoles: async (): Promise<Roles[]> => {
    const res = await apiClient.get(endpoints.roles);

    return res;
  },
  createRole: (data: any) => apiClient.post(endpoints.roles, data),

  updateRole: (id: string, data: any) =>
    apiClient.put(`${endpoints.roles}/${id}`, data),

  deleteRole: (id: string) => apiClient.delete(`${endpoints.roles}/${id}`),
};
