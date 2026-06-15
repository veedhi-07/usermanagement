import { apiClient } from "../../../api/apiclient";
import type { User } from "../../../types";
import { endpoints } from "../../../api/endpoints";

export const userApi = {
  getUsers: () => apiClient.get(endpoints.users),

  getUser: (id: string) => apiClient.get(`${endpoints.users}/${id}`),

  createUser: (data: Omit<User, "id">) => apiClient.post(endpoints.users, data),

  updateUser: (id: string, data: Omit<User, "id">) =>
    apiClient.put(`${endpoints.users}/${id}`, data),

  deleteUser: (id: string) => apiClient.delete(`${endpoints.users}/${id}`),
};
