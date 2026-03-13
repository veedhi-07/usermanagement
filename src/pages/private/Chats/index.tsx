import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { useState } from "react";
import ChatSection from "./chatsection";

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
