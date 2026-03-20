import type { ReactNode } from "react";
import { usePermission } from "../hooks/use-permission/usePermission";
import type { ModuleKey, ActionKey } from "../../src/redux/reducer/permissionSlice";

interface CanProps {
  module: ModuleKey;
  action: ActionKey;
  children: ReactNode;
}

const Can = ({ module, action, children }: CanProps) => {
  const { can } = usePermission();

  if (!can(module, action)) return null;

  return <>{children}</>;
};

export default Can;