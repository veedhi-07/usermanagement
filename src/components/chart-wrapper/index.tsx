import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type ChartWrapperProps = {
  title: string;
  type: any;
  series: any;
  options: ApexOptions;
  height?: number;
  width?: number;
};

export const ChartWrapper = ({
  title,
  type,
  series,
  options,
  height = 350,
  width = 500,
}: ChartWrapperProps) => {
  return (
    <div >
      <h1 className="text-lg font-semibold mb-3">{title}</h1>
      <Chart
        type={type}
        series={series}
        options={options}
        height={height}
        width={width}
      />
    </div>
  );
};
