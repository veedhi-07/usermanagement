import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { roleApi } from "../../services/rest-api-services/roles-service";
import type { Roles } from "../../types";

export const useRole = () => {
  return useQuery<Roles[]>({
    queryKey: ["roles"],
    queryFn: roleApi.getRoles,
  });
};
export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};
export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: any) => roleApi.updateRole(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};
export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
};
