import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { UsersRound,MessageCircle, UserKey,UserPen,Megaphone,LayoutDashboard } from "lucide-react";

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
          bg-linear-to-br from-blue-100 to-blue-200
          shadow-xl z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 text-lg font-bold border-b dark:border-gray-700">
          Menu
        </div>
        <nav className="flex flex-col gap-4 p-6 text-black dark:text-black">
         
          <Link to="/dashboard"
          className="flex items-center gap-2">
           <LayoutDashboard
                size={18}
                className="cursor-pointer text-black"
           />
           <span>Dashboard</span>
           </Link>

          <Link to="/users"
          className="flex items-center gap-2">
           <UsersRound
                size={18}
                className="cursor-pointer text-black"
           />
           <span>Users</span>
           </Link>

           <Link to="/chat"
           className="flex items-center gap-2">
            <MessageCircle
            size={18}
                className="cursor-pointer text-black"
          />
          <span>Chat</span>
          </Link>

          <Link to="/roles"
           className="flex items-center gap-2">
            <UserKey
            size={18}
                className="cursor-pointer text-black"
          />
          <span>Roles</span>
          </Link>

         
          <Link to="/campaign"
           className="flex items-center gap-2">
            <Megaphone
            size={18}
                className="cursor-pointer text-black"
          />
          <span>Campaign</span>
          </Link>

           <Link to="/myprofile"
           className="flex items-center gap-2">
            <UserPen
            size={18}
                className="cursor-pointer text-black"
          />
          <span>Edit Profile</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
