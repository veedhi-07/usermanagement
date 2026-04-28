import EcommerceMetrics from "../ecom-metrics";
import DashboardBarChart from "../../../../components/charts/bar";
export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
        </div>
        <div className="col-span-12">
          <div>
            <DashboardBarChart />
          </div>
        </div>
      </div>
    </>
  );
}
