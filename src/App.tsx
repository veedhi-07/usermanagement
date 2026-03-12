import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { fetchUserProfile } from "./services/userService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./services/firebase";
import { setProfile, clearProfile } from "../src/redux/reducer/profileSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  setPermissions,
  clearPermissions,
} from "../src/redux/reducer/permissionSlice";
import React from "react";
import { Navigate } from "react-router-dom";
import LoadSpinner from "./components/spinner";

const Login = React.lazy(() => import("./pages/public/login"));
const Signup = React.lazy(() => import("./pages/public/signup"));
const Dashboard = React.lazy(() => import("./pages/private/dashboard"));
const MyProfile = React.lazy(() => import("./pages/private/myprofile"));
const Users = React.lazy(() => import("./pages/private/users"));
const Roles = React.lazy(() => import("./pages/private/roles"));
const AddRole = React.lazy(() => import("./pages/private/addrole"));
const Chat = React.lazy(() => import("./pages/private/chats/index"));

const App = () => {
  const [authLoading, setAuthLoading] = useState(true);
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
        const roleRef = doc(db, "roles", profile.role);
        const roleSnap = await getDoc(roleRef);

        if (!roleSnap.exists()) {
          dispatch(clearPermissions());
          return;
        }

        const roleData = roleSnap.data();

        dispatch(setPermissions(roleData.permissions));
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};
export default App;
