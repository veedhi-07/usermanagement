import { Card } from "flowbite-react";
import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const profile = useAppSelector((state) => state.profile);

  return (
    <div className="flex min-h-screen">

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

  
      <div className="flex-1 flex flex-col">
   
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />


        <main className="flex-1 p-8 bg-linear-to-br from-blue-100 to-blue-200 flex justify-center items-center">
          <Card className="w-250 bg-white! shadow-lg rounded-xl">
            <h5 className="text-2xl font-bold tracking-tight text-black">
              Hello,{profile.firstName}!
            </h5>

            <p className="font-normal text-black">
              Welcome To User Management System Dashboard!!
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
