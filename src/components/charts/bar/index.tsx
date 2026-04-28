
import Chart from "react-apexcharts";
import { useDashboard } from "../../../features/dashboard/hooks";

export default function DashboardBarChart() {
  const { roleDistribution } = useDashboard();
  const series = [
    {
      name: "Users",
      data: roleDistribution.values,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: roleDistribution.categories,
    },
    colors: ["#3b82f6"],
    dataLabels: {
      enabled: true,
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
}
