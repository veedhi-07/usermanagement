import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getUsersApi,
} from "../../services/user-service";
export const useUser = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const queryClient = useQueryClient();

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";
  const Usersquery = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () =>
      getUsersApi({
        page,
        limit,
        search,
      }),
    enabled: true,
  });

  const createUser = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Created");
    },
  });

  const updateUser = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Updated");
    },
  });

  const deleteUser = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Deleted");
    },
  });

  return {
    users: Usersquery.data?.data?.users ?? [],
    total: Usersquery.data?.data?.pagination?.total ?? 0,
    totalPages: Usersquery.data?.data.pagination?.totalPages ?? 0,

    isLoading: Usersquery.isLoading,
    isError: Usersquery.isError,
    isPending: Usersquery.isPending,

    createUser,
    updateUser,
    deleteUser,
  };
};
//invalidate queries for refetch
