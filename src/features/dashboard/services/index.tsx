import { apiClient } from "../../../lib/apiclient/index";
import { endpoints } from "../../../lib/endpoints";

export const getDashboardApi = async () => {
  const res = await apiClient.get(endpoints.dashboard);

  return res.data;
};
