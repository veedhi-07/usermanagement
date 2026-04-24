import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../../types";
import {
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getUsersApi,
} from "../../services/user-service";

export const useUser = (page?: number, limit?: number) => {
  const queryClient = useQueryClient();

  const usersquery = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsersApi({ page: page!, limit: limit! }),
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
    users: usersquery.data?.users ?? [],
    total: usersquery.data?.total ?? 0,
    totalPages: usersquery.data?.totalPages ?? 0,

    isLoading: usersquery.isLoading,
    isError: usersquery.isError,
    isFetching: usersquery.isFetching,
    isPending: usersquery.isPending,

    createUser,
    updateUser,
    deleteUser,
  };
};
//invalidate queries for refetch
