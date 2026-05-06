import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getRolesApi,
} from "../../services/role-service";

export const useRole = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const queryClient = useQueryClient();

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = params?.search ?? "";

  const Rolesquery = useQuery({
    queryKey: ["roles", page, limit, search],
    
    queryFn: () =>
      getRolesApi({
        page,
        limit,
        search,
      }),
    enabled: true,
    
  });
  const createRole = useMutation({
    mutationFn: createRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Created");
    },
    onError: (err) => {
      console.log("CREATE ERROR:", err);
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
  console.log("ROLES RESPONSE:", Rolesquery.data);
  return {
    roles: Rolesquery.data?.roles ?? [],
    isLoading: Rolesquery.isLoading,
    isError: Rolesquery.isError,
    total: Rolesquery.data?.pagination?.total ?? 0,
    totalPages: Rolesquery.data?.pagination?.totalPages ?? 0,

    isPending: Rolesquery.isPending,

    createRole,
    updateRole,
    deleteRole,
  };
};
//invalidate queries for refetch
