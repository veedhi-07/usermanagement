import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import { useState } from "react";
import ChatSidebar from "../Chat/ChatSidebar";
import ChatWindow from "./ChatWindow";

const mainChat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row min-h-screen ">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-row">
          <div>
            <ChatSidebar />
          </div>
          <div>
            <ChatWindow />
          </div>
        </div>
        </div>
      </div>
    </>
  );
};
export default mainChat;
