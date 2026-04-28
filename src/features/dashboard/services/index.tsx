import { apiClient } from "../../../lib/apiclient/index";

export const getDashboardApi = async () => {
  const res = await apiClient.get("/dashboard");

  return res.data; 
};
