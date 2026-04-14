import { useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarToggle,
} from "flowbite-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { useNavigate } from "react-router-dom";
import type { NavProps } from "../../../types";
import * as Sentry from "@sentry/react";

const Nav = ({ onMenuClick }: NavProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = useNavigate();

  //Loggedin User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      Sentry.setUser(null);
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const handleprofile = async () => {
    try {
      navigate("/myprofile");
    } catch (error) {
      console.error("Can't Navigate", error);
    }
  };

  return (
    <Navbar fluid rounded className="!bg-blue-50! dark:bg-gray-900 shadow-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className=" cursor-pointer text-2xl text-black dark:text-white"
        >
          ☰
        </button>

        <NavbarBrand href="/">
          <span className="text-xl font-semibold text-black dark:text-white">
            User Management
          </span>
        </NavbarBrand>
      </div>

      <div className="flex md:order-2 items-center gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User" img="" rounded className="cursor-pointer" />
          }
        >
          <DropdownHeader>
            <span className=" cursor-pointer block text-sm font-medium">
              {currentUser?.displayName}
            </span>
            <span className="block truncate text-sm text-white-100">
              {currentUser?.email}
            </span>
          </DropdownHeader>

          <DropdownDivider />
          <DropdownItem onClick={handleprofile}>My Profile</DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
        </Dropdown>

        <NavbarToggle />
      </div>
    </Navbar>
  );
};

export default Nav;
