import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { ModuleKey, ActionKey } from "../redux/reducer/permissionSlice";

export const usePermission = () => {
  const permissions = useSelector((state: RootState) => state.permission);

  const can = (module: ModuleKey, action: ActionKey): boolean => {
    return permissions?.[module]?.[action] === true;
  };

  return { can };
};
