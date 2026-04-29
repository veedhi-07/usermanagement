import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "../services";
import { User } from "../../../types";

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

  //  Monthly users
  const monthlyUsers = useMemo(() => {
    const months = new Array(12).fill(0);

    const users = dashboard.recentUsers || [];

    users.forEach((user: any) => {
      const date = new Date(user.joinedAt);
      if (!isNaN(date.getTime())) {
        months[date.getMonth()]++;
      }
    });

    return months;
  }, [dashboard.recentUsers]);

  //  Role distribution
  const roleDistribution = useMemo(() => {
    const map: Record<string, number> = {};

    (dashboard.recentUsers || []).forEach((user: User) => {
      const role = user.roleTitle || "Unknown";
      map[role] = (map[role] || 0) + 1;
    });

    return {
      categories: Object.keys(map),
      values: Object.values(map),
    };
  }, [dashboard.recentUsers]);

  return {
    isLoading,
    error,

    stats: dashboard.stats,
    recentUsers: dashboard.recentUsers,

    monthlyUsers,
    roleDistribution,
  };
};
