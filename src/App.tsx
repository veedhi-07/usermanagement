import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/components/firebase";
import { fetchUserProfile } from "./services/userService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./components/firebase";
import {
  setProfile,
  clearProfile,
} from "../src/redux/reducer/profileSlice";

import {
  setPermissions,
  clearPermissions,
} from "../src/redux/reducer/permissionSlice";

import React from "react";

const Login = React.lazy(() => import("./pages/public/Login"));
const Signup = React.lazy(() => import("./pages/public/signup"));
const Home = React.lazy(() => import("./pages/private/Home"));
const Dashboard = React.lazy(() => import("./pages/private/Dashboard"));
const MyProfile = React.lazy(() => import("./pages/private/MyProfile"));
const Users = React.lazy(() => import("./pages/private/Users"));
const Roles = React.lazy(() => import("./pages/private/Roles"));
const AddRole = React.lazy(() => import("./pages/private/AddRole"));

const App = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

useEffect(() => {
  console.log("PROFILE CHANGED:", profile);

}, [profile?.role, dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchUserProfile(
          user.uid,
          user.email ?? ""
        );

        if (data) {
          dispatch(setProfile({ uid: user.uid, ...data }));
        }
      } else {
        dispatch(clearProfile());
        dispatch(clearPermissions());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

useEffect(() => {
  const loadRolePermissions = async () => {
    if (!profile?.role) return;

    try {
      const roleRef = doc(db, "roles", profile.role);
      const roleSnap = await getDoc(roleRef);

      if (roleSnap.exists()) {
        const roleData = roleSnap.data();
        dispatch(setPermissions(roleData.permissions));
      }
    } catch (error) {
      console.error("Failed to load role permissions:", error);
    }
  };

  loadRolePermissions();
}, [profile?.role, dispatch]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/add-role" element={<AddRole />} />
        <Route path="/edit-role/:id" element={<AddRole />} />
      </Routes>
    </Suspense>
  );
};

export default App;