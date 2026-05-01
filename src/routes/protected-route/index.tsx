import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  const isAuthenticated = !!token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}
//outlet is placeholder to render child routes
//replcae to avoid back routing
