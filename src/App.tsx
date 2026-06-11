import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { fetchUserProfile } from "./services/firebase/profile-service/index";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import {
  setProfile,
  clearProfile,
} from "../src/redux/reducer/profile-slice/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setPermissions,
  clearPermissions,
} from "../src/redux/reducer/permission-slice/index";
import React from "react";
import { Navigate } from "react-router-dom";
import { Suspense } from "react";
import { rolesService } from "./services/firebase/roles-service/index";
import LoadSpinner from "./components/common/spinner";
import { setupNotification } from "./services/firebase";
import type { Permissions } from "./types";

const Login = React.lazy(() => import("./pages/public/Login"));
const Signup = React.lazy(() => import("./pages/public/signup"));
const Dashboard = React.lazy(() => import("./features/dashboard"));
const MyProfile = React.lazy(() => import("./pages/private/myprofile"));
const Users = React.lazy(() => import("./features/users"));
const Roles = React.lazy(() => import("./features/roles"));
const AddRole = React.lazy(() => import("./features/roles/addeditrole"));
const Chat = React.lazy(() => import("./features/chat"));
const ErrorBoundry = React.lazy(() => import("./pages/public/errorboundry"));

const App = () => {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setupNotification();
  }, []);
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchUserProfile(user.uid, user.email ?? "");

        if (data) {
          dispatch(setProfile({ uid: user.uid, ...data }));
        }
      } else {
        dispatch(clearProfile());
        dispatch(clearPermissions());
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    const loadRolePermissions = async () => {
      try {
        if (!profile?.role) {
          dispatch(clearPermissions());
          return;
        }
        const roles = await rolesService.getAll();
        const role = roles.find((r) => r.id === profile.role);
        if (!role) {
          dispatch(clearPermissions());
          return;
        }
        dispatch(setPermissions(role.permissions as Permissions));
      } catch (error) {
        console.error("Failed to load role permissions:", error);
        dispatch(clearPermissions());
      }
    };

    loadRolePermissions();
  }, [profile?.role, dispatch]);
  if (authLoading) {
    return <LoadSpinner />;
  }
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Suspense fallback={<LoadSpinner />}>
        <Routes>
          {!profile?.uid ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/add-role" element={<AddRole />} />
              <Route path="/edit-role/:id" element={<AddRole />} />
              <Route path="/errorboundry" element={<ErrorBoundry />} />
              <Route
                path="*"
                element={<Navigate to="/errorboundry" replace />}
              />
            </>
          )}
        </Routes>
      </Suspense>
    </>
  );
};
export default App;
