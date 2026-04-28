
import { useAppSelector } from "../../redux/hook";
import type { ActionKey } from "../../types";

export const usePermission = () => {
  const permissions = useAppSelector((state) => state.permission);

  console.log("PERMISSIONS STATE:", permissions);
  
  const can = (module: string, action: ActionKey): boolean => {
    const modulePermission = permissions[module];

    if (!modulePermission) return false;

    return Boolean(modulePermission[action]);
  };

  return { can };
};
