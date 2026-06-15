import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { userApi } from "../../services/rest-api-services/users-service";

export const useUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getUsers,
  });
};
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: any) => userApi.updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
