import { createPortal } from "react-dom";

const Portal = ({ children }: { children: React.ReactNode }) => {
  const ele = document.getElementById("portal-root");
  if (!ele) return null;
  return createPortal(children, ele);
};
export default Portal;
