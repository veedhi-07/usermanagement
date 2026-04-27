// // services/dashboard-service.ts
import { apiClient } from "../../../lib/apiclient/index";

export const getDashboardApi = async () => {
  const res = await apiClient.get("/dashboard");

  console.log("RAW RESPONSE:", res);

  return res.data; //  IMPORTANT FIX
};
