import { Timestamp } from "firebase/firestore";
import type { User } from "../../types";
export const getDate = (value?: string | Timestamp): Date | null => {
  if (!value) return null;

  return typeof value === "string" ? new Date(value) : value.toDate();
};
export const getItemsPerMonth = (items:any[]) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const map: Record<string, number> = {};
  months.forEach((m) => (map[m] = 0));

  items.forEach((item) => {
    const date = getDate(item.createdAt);
    if (!date) return;
    
    map[months[date.getMonth()]]++;
  });

  return {
    categories: months,
    data: months.map((m) => map[m]),
  };
};
export const getRoleDistribution = (users: User[]) => {
  const roleMap: Record<string, number> = {};

  users.forEach((user) => {
    roleMap[user.role] = (roleMap[user.role] || 0) + 1;
  });

  return {
    labels: Object.keys(roleMap),
    series: Object.values(roleMap),
  };
};
