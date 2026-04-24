import { apiClient } from "../../../../lib/apiclient";
import { User } from "../../../../types";

// GET ALL USERS
// export const getUsersApi = async (): Promise<User[]> => {
//   const res = await apiClient.get("/users");
//   console.log("DATA:", res);

//   return res.data.users;
// };
// export const getUsersApi = async ({
//   page ,
//   limit ,
//   search,
// }: {
//   page?: number;
//   limit?: number;
//   search?: string;
// }): Promise<{
//   users: User[];
//   total: number;
//   page: number;
//   limit: number;
// }> => {
//   const res = await apiClient.get("/users", {
//     params: {
//       page,
//       limit,
//       search,
//     },
//   });

//   return res.data;
// };
export const getUsersApi = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const res = await apiClient.get("/users", {
    params: {
      page,
      limit,
    },
  });
  console.log("API RESPONSE:", res.data);
  // return {
  //   users: res.data.data.users,
  //   total: res.data.data.pagination.total,
  //   totalPages: res.data.data.pagination.totalPages,
  // };
  return {
    users: res.data.users ?? res.data.data?.users ?? [],
    total: res.data.pagination?.total ?? res.data.data?.pagination?.total ?? 0,
    totalPages:
      res.data.pagination?.totalPages ??
      res.data.data?.pagination?.totalPages ??
      0,
  };
};
//GET SINGLE USER
export const getUserByIdApi = async (id: number): Promise<User> => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data.user;
};

//  CREATE USER
export const createUserApi = async (data: Partial<User>) => {
  const res = await apiClient.post("/users", data);
  return res.data;
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
  return res.data;
};

// DELETE USER
export const deleteUserApi = async (id: number) => {
  const res = await apiClient.delete(`/users/${id}`);
  return res.data;
};
