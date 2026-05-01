import { apiClient } from "../../../../lib/apiclient";
import {
  DeleteUserResponse,
  GetUsersResponse,
  User,
  UserMutationResponse,
} from "../../types";
import { endpoints } from "../../../../lib/endpoints";

export const getUsersApi = async ({
  page,
  limit,
  search,
}: {
  page: number;

  limit: number;
  search: string;
}): Promise<GetUsersResponse> => {
  const res = await apiClient.get(endpoints.users, {
    params: {
      page,
      limit,
      search,
    },
  });

  return res;
};

export const getUserByIdApi = async (id: number): Promise<User> => {
  const res = await apiClient.get(`${endpoints.users}/${id}`);
  return res.data.user;
};

export const createUserApi = async (
  data: Partial<User>,
): Promise<UserMutationResponse> => {
  const res = await apiClient.post(endpoints.users, data);
  return res.data;
};

export const updateUserApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<User>;
}): Promise<UserMutationResponse> => {
  const res = await apiClient.put(`${endpoints.users}/${id}`, data);
  return res.data;
};

export const deleteUserApi = async (
  id: number,
): Promise<DeleteUserResponse> => {
  const res = await apiClient.delete(`${endpoints.users}/${id}`);
  return res.data;
};
