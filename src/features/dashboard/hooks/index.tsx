
import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "../services";

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
  });

  //  normalize
  const dashboard = data?.data ??
    data ?? {
      stats: { totalUsers: 0, totalEmployees: 0 },
      recentUsers: [],
    };


  return {
    isLoading,
    error,

    stats: dashboard.stats,
    recentUsers: dashboard.recentUsers,
  };
};

