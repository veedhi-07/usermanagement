
import { useState } from "react";
import Nav from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-200 via-pink-100 to-purple-200 dark:bg-gray-800">

      {/* Navbar */}
      <Nav onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="p-8 text-black dark:text-black">
        <h1 className="text-3xl font-bold">
          Welcome to Dashboard
        </h1>
      </main>

    </div>
  );
};

export default Home;
