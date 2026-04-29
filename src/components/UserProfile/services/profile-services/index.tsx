import { apiClient } from "../../../../lib/apiclient";
import { ProfileValues } from "../../../../types";


export const updateProfileApi = async (data: ProfileValues) => {
  // console.log("API CALLED WITH:", data);

  const res = await apiClient.put("/profile", data);
  // console.log("API RESPONSE:", res);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await apiClient.get("/profile");
  return res.data;
};
