import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../../services/user-services";
import { ProfileValues } from "../../../../types";
import toast from "react-hot-toast";
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileValues) => {
      const res = await updateProfileApi(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Updated");
    },
  });
};
