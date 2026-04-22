import { useMutation } from "@tanstack/react-query";
import { updateProfileApi } from "../../services/user-services";
import { ProfileValues } from "../../../../types";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: ProfileValues) => {
      const res = await updateProfileApi(data);
      return res;
    },
  });
};
