import { apiClient } from "../../../../lib/apiclient";
import { ProfileValues } from "../../../../types";
import { endpoints } from "../../../../lib/endpoints";

export const updateProfileApi = async (data: ProfileValues) => {
  // console.log("API CALLED WITH:", data);

  const res = await apiClient.put(endpoints.profile, data);
  // console.log("API RESPONSE:", res);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await apiClient.get(endpoints.profile);
  return res.data;
};
