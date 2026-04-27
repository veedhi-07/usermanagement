import { BrowserRouter as Router, Routes, Route } from "react-router";
import React from "react";
import AuthLayout from "./features/auth/authlayout/index";
import ProtectedRoute from "./routes/protected-route";
import { ScrollToTop } from "./components/common/scroll-to-top";
import { Toaster } from "react-hot-toast";

const AppLayout = React.lazy(() => import("./layout/app-layout"));
const Home = React.lazy(
  () => import("./features/dashboard/components/main/index"),
);
const UserProfiles = React.lazy(
  () => import("./components/UserProfile/components/main/index"),
);
const UserTable = React.lazy(
  () => import("./features/users/components/main-user-table/index"),
);
const RoleTable = React.lazy(
  () => import("./features/roles/components/main-role-table/index"),
);

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<AuthLayout />} />
          <Route path="/signup" element={<AuthLayout />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/user-table" element={<UserTable />} />
              <Route path="/role-table" element={<RoleTable />} />
            </Route>
          </Route>
          {/* FALLBACK */}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Router>
    </>
  );
}
