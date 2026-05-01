import { Navigate, Outlet, replace } from "react-router-dom";

export default function PublicRoute() {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
//replcae to avoid back routing
//outlet is placeholder to render child routes
