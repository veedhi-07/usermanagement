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

interface NavProps {
  onMenuClick: () => void;
}

const Nav = ({ onMenuClick }: NavProps) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Navbar fluid rounded className="!bg-rose-300 dark:bg-gray-900 shadow-md">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-2xl text-black dark:text-white"
        >
          ☰
        </button>

        <NavbarBrand href="/">
          <span className="text-xl font-semibold text-black dark:text-white">
            User Management
          </span>
        </NavbarBrand>
      </div>

      {/* RIGHT SIDE (unchanged) */}
      <div className="flex md:order-2 items-center gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">User</span>
            <span className="block truncate text-sm font-medium">
              user@email.com
            </span>
          </DropdownHeader>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>

        <NavbarToggle />
      </div>
    </Navbar>
  );
};

export default Nav;
