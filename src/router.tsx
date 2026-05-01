import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import ProtectedRoute from "./routes/protected-route";
import PublicRoute from "./routes/public-route";

const AppLayout = lazy(() => import("./layout/app-layout"));
const AuthLayout = lazy(() => import("./layout/authlayout"));

const Home = lazy(() => import("./features/dashboard"));
const UserProfiles = lazy(() => import("./features/profile"));
const RoleTable = lazy(() => import("./features/roles"));
const UserTable = lazy(() => import("./features/users"));
const NotFound = lazy(() => import("./features/notfound"));

const SignUpForm = lazy(() => import("./features/auth/components/signupform"));
const SignInForm = lazy(() => import("./features/auth/components/signinform"));

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
