import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileApi, updateProfileApi } from "../../services/user-services";
import { ProfileValues } from "../../../../types";
import toast from "react-hot-toast";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const Profilequery = useQuery({
    queryKey: ["users"],
    queryFn: getProfileApi,
  });

  const UpdateProfile = useMutation({
    mutationFn: async (data: ProfileValues) => {
      const res = await updateProfileApi(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Updated");
    },
  });

  return {
    profile: Profilequery.data,
    isLoading: Profilequery.isLoading,
    isError: Profilequery.isError,
    isPending: Profilequery.isPending,

    UpdateProfile,
  };
};
