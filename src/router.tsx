import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AppLayout = lazy(() => import("./layout/app-layout"));
const AuthLayout = lazy(() => import("./layout/authlayout"));
const Home = lazy(() => import("./features/dashboard"));
const UserProfiles = lazy(() => import("./features/profile"));
const RoleTable = lazy(() => import("./features/roles"));
const UserTable = lazy(() => import("./features/users"));
const NotFound = lazy(() => import("./features/notfound"));
const SignUpForm = lazy(() => import("./features/auth/components/signupform"));
const SignInForm = lazy(() => import("./features/auth/components/signinform"));

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};
//replcae to avoid back routing
//outlet is placeholder to render child routes

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "profile", element: <UserProfiles /> },
          { path: "users", element: <UserTable /> },
          { path: "roles", element: <RoleTable /> },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/signin", element: <SignInForm /> },
          { path: "/signup", element: <SignUpForm /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
