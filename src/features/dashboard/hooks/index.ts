import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "../services";

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardApi,
    initialData: {
      stats: { totalUsers: 0, totalEmployees: 0 },
      recentUsers: [],
    },
  });

  const monthlyUsers = useMemo(() => {
    const months = new Array(12).fill(0);

    // const users = data?.recentUsers || [];

    const users = Array.isArray(data?.recentUsers) ? data.recentUsers : [];

    users.forEach((user: any) => {
      const date = new Date(user.joinedAt);

      if (isNaN(date.getTime())) return;

      const month = date.getMonth();
      months[month]++;
    });

    return months;
  }, [data?.recentUsers]); // IMPORTANT CHANGE

  // return {
  //   stats: data?.stats || { totalUsers: 0, totalEmployees: 0 },
  //   recentUsers: data?.recentUsers || [],
  //   monthlyUsers,
  //   isLoading,
  //   error,
  // };
  // return {
  //   stats: data?.stats ??
  //     data?.data?.stats ?? { totalUsers: 0, totalEmployees: 0 },
  //   recentUsers: data?.recentUsers ?? data?.data?.recentUsers ?? [],
  //   monthlyUsers,
  //   isLoading,
  //   error,
  // };
  return {
    stats: data?.data?.stats ??
      data?.stats ?? { totalUsers: 0, totalEmployees: 0 },
    recentUsers: data?.data?.recentUsers ?? data?.recentUsers ?? [],
  };
};
