import { apiClient } from "../../../../lib/apiclient";
import {
  DeleteUserResponse,
  GetUsersResponse,
  User,
  UserMutationResponse,
} from "../../types";

export const getUsersApi = async ({
  page,
  limit,
  search,
}: {
  page: number;

  limit: number;
  search: string;
}): Promise<GetUsersResponse> => {
  const res = await apiClient.get(`${import.meta.env.VITE_API_URL}/api/users`, {
    params: {
      page,
      limit,
      search,
    },
  });
  return res;
};

export const getUserByIdApi = async (id: number): Promise<User> => {
  const res = await apiClient.get(
    `${import.meta.env.VITE_API_URL}/api/users}/${id}`,
  );
  return res.data.user;
};

export const createUserApi = async (
  data: Partial<User>,
): Promise<UserMutationResponse> => {
  const res = await apiClient.post(
    `${import.meta.env.VITE_API_URL}/api/users`,
    data,
  );
  return res.data;
};

export const updateUserApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<User>;
}): Promise<UserMutationResponse> => {
  const res = await apiClient.put(
    `${import.meta.env.VITE_API_URL}/api/users/${id}`,
    data,
  );
  return res.data;
};

export const deleteUserApi = async (
  id: number,
): Promise<DeleteUserResponse> => {
  const res = await apiClient.delete(
    `${import.meta.env.VITE_API_URL}/api/users/${id}`,
  );
  return res.data;
};
