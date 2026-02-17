import './App.css'
import {Routes, Route} from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/components/firebase";
import { fetchUserProfile } from "./services/userService";
import { useDispatch } from "react-redux";
import { setProfile, clearProfile } from "../src/redux/reducer/profileSlice.ts";

import Login from './pages/public/Login';
import Signup from './pages/public/signup';
import Home from './pages/private/Home';
import Dashboard from './pages/private/Dashboard';
import MyProfile from './pages/private/MyProfile';
import Users from './pages/private/Users/index.tsx';

const App = () => {
  const dispatch = useDispatch(); // add this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth user:",user);

      if (user) {
        const data = await fetchUserProfile(user.uid, user.email ?? "");
        console.log("Fetched profile:",data);
      
        if (data) {
          dispatch(setProfile({ uid: user.uid, ...cleanData }));
        }
      } else {
        dispatch(clearProfile());
      }
    });

    return () => unsubscribe();
  }, [dispatch]); //dependency added

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}
export default App;