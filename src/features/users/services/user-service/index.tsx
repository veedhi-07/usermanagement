import { apiClient } from "../../../../lib/apiclient";
import { User } from "../../../../types";
import { endpoints } from "../../../../lib/endpoints";

export const getUsersApi = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const res = await apiClient.get(endpoints.users, {
    params: {
      page,
      limit,
    },
  });

  return {
    users: res.data.users ?? res.data.data?.users ?? [],
    total: res.data.pagination?.total ?? res.data.data?.pagination?.total ?? 0,
    totalPages:
      res.data.pagination?.totalPages ??
      res.data.data?.pagination?.totalPages ??
      0,
  };
};

export const getUserByIdApi = async (id: number): Promise<User> => {
  const res = await apiClient.get(`${endpoints.users}/${id}`);
  return res.data.user;
};

export const createUserApi = async (data: Partial<User>) => {
  const res = await apiClient.post(endpoints.users, data);
  return res.data;
};

export const updateUserApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<User>;
}) => {
  const res = await apiClient.put(`${endpoints.users}/${id}`, data);
  return res.data;
};

export const deleteUserApi = async (id: number) => {
  const res = await apiClient.delete(`${endpoints.users}/${id}`);
  return res.data;
};
