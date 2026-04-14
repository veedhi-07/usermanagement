import Navbar from "../../components/layout/navbar";
import Sidebar from "../../components/layout/sidebar";
import { useState } from "react";
import ChatSection from "./chatsection/index";
const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ChatSection sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
};
export default Chat;
