import toast from "react-hot-toast";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getRolesApi,
} from "../../services/role-service";

export const useRole = () => {
  
  const queryClient = useQueryClient();

  const Rolesquery = useQuery({
    queryKey: ["roles"],
    queryFn: getRolesApi,
  });

  const createRole = useMutation({
    mutationFn: createRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Created");
    },
  });

  const updateRole = useMutation({
    mutationFn: updateRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Updated");
    },
  });

  const deleteRole = useMutation({
    mutationFn: deleteRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Deleted");
    },
  });

  return {
    roles: Rolesquery.data,
    isLoading: Rolesquery.isLoading,
    isError: Rolesquery.isError,
    isPending: Rolesquery.isPending,

    createRole,
    updateRole,
    deleteRole,
  };
};
//invalidate queries for refetch
