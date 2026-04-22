import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getUsersApi,
} from "../../services/user-service";

export const useUser = () => {
  const queryClient = useQueryClient();

  const usersquery = useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });

  const createUser = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => toast.success("Created"),
  });

  const updateUser = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => toast.success("Updated"),
  });

  const deleteUser = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => toast.success("Deleted"),
  });

  return {
    users: usersquery.data,
    isLoading: usersquery.isLoading,
    isError: usersquery.isError,

    createUser,
    updateUser,
    deleteUser,
  };
};
