import { apiClient } from "../../../../lib/apiclient";
import { User } from "../../../../types";

// GET ALL USERS
export const getUsersApi = async (): Promise<User[]> => {
  const res = await apiClient.get("/users");
  return res.data.users;
};

//GET SINGLE USER
export const getUserByIdApi = async (id: number): Promise<User> => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data.user;
};

//  CREATE USER
export const createUserApi = async (data: Partial<User>) => {
  const res = await apiClient.post("/users", data);
  return res.data.user;
};

//  UPDATE USER
export const updateUserApi = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<User>;
}) => {
  const res = await apiClient.put(`/users/${id}`, data);
  return res.data.user;
};

// DELETE USER
export const deleteUserApi = async (id: number) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data.user;
};
