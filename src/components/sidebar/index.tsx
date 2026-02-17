import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64
          bg-gradient-to-br from-blue-100 to-blue-200
          shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 text-lg font-bold border-b dark:border-gray-700">
          Menu
        </div>

        <nav className="flex flex-col gap-4 p-6 text-black dark:text-black">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/roles">Role</Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
