import { Timestamp } from "firebase/firestore";
import { usePermission } from "../hooks/use-permission/usePermission";
export interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: Timestamp;
}
export interface Role {
  id: string;
  name: string;
  permissions: Permissions;
  createdAt?: Timestamp;
}
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}
