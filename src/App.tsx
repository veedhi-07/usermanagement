import './App.css'
import {Routes, Route} from "react-router-dom";
import { Suspense, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/components/firebase";
import { fetchUserProfile } from "./services/userService";
import { useDispatch } from "react-redux";
import { setProfile, clearProfile } from "../src/redux/reducer/profileSlice.ts";
import React from 'react';

import { seedData } from "./utils/seedData";

const Login = React.lazy(() => import('./pages/public/Login'));
const Signup = React.lazy(() => import('./pages/public/signup'));
const Home = React.lazy(() => import('./pages/private/Home'));
const Dashboard = React.lazy(() => import('./pages/private/Dashboard'));
const MyProfile = React.lazy(() => import('./pages/private/MyProfile'));
const Users = React.lazy(() => import('./pages/private/Users'));
const Roles = React.lazy(() => import('./pages/private/Roles'));
const AddRole = React.lazy(() => import ('./pages/private/AddRole'))
const App = () => {
  const dispatch = useDispatch(); // add this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth user:",user);

      if (user) {
        const data = await fetchUserProfile(user.uid, user.email ?? "");
        console.log("Fetched profile:",data);
      
        if (data) {
          dispatch(setProfile({ uid: user.uid, ...data }));
        }
      } else {
        dispatch(clearProfile());
      }
    });

    return () => unsubscribe();
  }, [dispatch]); //dependency added

  useEffect(() => {
    seedData();
  }, []);
       
  return (
    <>
    <Suspense>
  <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/users" element={<Users />} />
      <Route path="/roles" element = {<Roles/>}/>
      <Route path = "/add-role" element = {<AddRole/>}/>
      <Route path="/edit-role/:id" element={<AddRole />} />

Now same component handles both.
    </Routes>
  </Suspense>
      </>
  );
}
export default App;    