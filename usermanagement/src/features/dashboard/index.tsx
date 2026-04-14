import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";
import { useState } from "react";
import ChartCard from "../../components/chardcard";
import { chartConfig } from "../../config";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            Dashboard Overview
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {chartConfig.map(({ title, Component }, index) => (
              <ChartCard key={index} title={title}>
                <Component />
              </ChartCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
