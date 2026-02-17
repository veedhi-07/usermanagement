import { Card } from "flowbite-react";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

const profile = useAppSelector((state) => state.profile);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dashboard content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center">
          <Card className="w-250 bg-white! shadow-lg rounded-xl">
            <h5 className="text-2xl font-bold tracking-tight text-black">
              Welcome to Dashboard,{profile.firstName}!
            </h5>

            <p className="font-normal text-black">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
