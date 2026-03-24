import { usePermission } from "../hooks/use-permission/usePermission";
import type { CanProps } from "../types";

const Can = ({ module, action, children }: CanProps) => {
  const { can } = usePermission();

  if (!can(module, action)) return null;

  return <>{children}</>;
};

export default Can;
