import { Link } from "react-router-dom";
import {
  UsersRound,
  MessageCircle,
  UserKey,
  UserPen,
  Megaphone,
  LayoutDashboard,
} from "lucide-react";
import { usePermission } from "../../hooks/use-permission/usePermission";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { can } = usePermission();

  const canViewUsers = can("user", "view");
  const canViewRoles = can("role", "view");
  const canViewCampaign = can("campaign", "view");
  const canViewChat = can("chat", "view");
  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
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
          {/* Dashboard Always Visible */}
          <Link to="/dashboard" className="flex items-center gap-4">
            <LayoutDashboard size={18} className="cursor-pointer text-black" />
            <span>Dashboard</span>
          </Link>

          {/* Users */}
          {canViewUsers && (
            <Link to="/users" className="flex items-center gap-4">
              <UsersRound size={18} className="cursor-pointer text-black" />
              <span>Users</span>
            </Link>
          )}

          {/* Chat */}
          {canViewChat && (
            <Link to="/chat" className="flex items-center gap-4">
              <MessageCircle size={18} className="cursor-pointer text-black" />
              <span>Chat</span>
            </Link>
          )}

          {/* Roles */}
          {canViewRoles && (
            <Link to="/roles" className="flex items-center gap-4">
              <UserKey size={18} className="cursor-pointer text-black" />
              <span>Roles</span>
            </Link>
          )}

          {/* Campaign */}
          {canViewCampaign && (
            <Link to="/campaign" className="flex items-center gap-4">
              <Megaphone size={18} className="cursor-pointer text-black" />
              <span>Campaign</span>
            </Link>
          )}

          {/* Edit Profile Always Visible*/}
          <Link to="/myprofile" className="flex items-center gap-4">
            <UserPen size={18} className="cursor-pointer text-black" />
            <span>Edit Profile</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
