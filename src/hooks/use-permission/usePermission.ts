import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "../../redux/store";
import type { ModuleKey, ActionKey } from "../../redux/reducer/permissionSlice";

export const usePermission = () => {
  const permissions = useSelector((state: RootState) => state.permission);

  return useMemo(
    () => ({
      can: (module: ModuleKey, action: ActionKey): boolean =>
        permissions?.[module]?.[action] === true,
    }),
    [permissions],
  );
};
