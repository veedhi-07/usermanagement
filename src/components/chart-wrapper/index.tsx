import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type ChartWrapperProps = {
  type: any;
  series: any;
  options: ApexOptions;
  height?: number;
  width?: number;
};

export const ChartWrapper = ({
  type,
  series,
  options,
  height = 350,
  width = 500,
}: ChartWrapperProps) => {
  return (
    <div>
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
