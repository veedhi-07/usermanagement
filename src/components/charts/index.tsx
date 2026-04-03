import type { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { getRoleDistribution } from "../../utils/chartutils/index";
import { ChartWrapper } from "../chart-wrapper";
import { useUser } from "../../hooks/use-user";
import { useRole } from "../../hooks/use-role";
import { getItemsPerMonth } from "../../utils/chartutils";

//Bar chart depicts no of permission a role have
export const BarChart = () => {
  const [series, setSeries] = useState([
    { name: "Permissions", data: [] as number[] },
  ]);
  const [categories, setCategories] = useState<String[]>([]);
  const { data: roles = [] } = useRole();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!roles || !Array.isArray(roles)) {
          return;
        }
        const categories: string[] = [];
        const data: number[] = [];

        roles.forEach((roleItem: any) => {
          let count = 0;
          const permissions = roleItem.permissions || {};
          for (const key in permissions) {
            const module = permissions[key];
            if (module.view) count++;
            if (module.add) count++;
            if (module.edit) count++;
            if (module.delete) count++;
          }
          categories.push(roleItem.role || "Unknown");
          data.push(count);
        });
        setCategories(categories);
        setSeries([{ name: "Permissions", data: data.length ? data : [0] }]);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, [roles]);

  const options: ApexOptions = {
    plotOptions: {
      bar: { horizontal: false },
    },
    xaxis: { categories: categories },
  };
  return (
    <>
      <ChartWrapper
        title="Bar Chart"
        type="bar"
        options={options}
        series={series}
      />
    </>
  );
};

//PieChart depicts roles per users
export const PieChart = () => {
  const { data: users = [] } = useUser();
  const { labels, series } = getRoleDistribution(users);
  const options: ApexOptions = {
    labels,
    legend: {
      position: "top",
    },
    colors: [
      "#008FFB",
      "#25ce95",
      "#FEB019",
      "#FF4560",
      "#93279c",
      "#ca6fd6",
      "#4d32af",
      "#ccd63c",
      "#ecc1c7",
    ],
  };
  return (
    <>
      <ChartWrapper
        type="pie"
        title="Pie Chart"
        options={options}
        series={series}
      />
    </>
  );
};

//Line chart depicts number of users created in a month
export const LineChart = () => {
  const { data: users = [], isLoading } = useUser();
  const { categories, data } = getItemsPerMonth(users);

  const series = [{ name: "Users Created", data }];
  const options: ApexOptions = {
    chart: { id: "line-chart", zoom: { enabled: true } },
    xaxis: { categories },
    stroke: { width: 3, curve: "smooth" },
    markers: { size: 5 },
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <ChartWrapper
        title="Line Chart"
        options={options}
        series={series}
        type="line"
      />
    </>
  );
};
//area Chart depicts number of users created in a month
export const AreaChart = () => {
  const { data: users = [] } = useUser();

  const { data } = getItemsPerMonth(users);
  const series = [{ name: "Users Created", data }];
  const options: ApexOptions = {
    chart: { id: "area-chart", zoom: { enabled: true } },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient" },
  };
  return (
    <>
      <ChartWrapper
        options={options}
        series={series}
        type="area"
        title="Area Chart"
      />
    </>
  );
};
//box plot with dummy data
export const BoxPlot = () => {
  const options: ApexOptions = {
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#5C4742",
          lower: "#A5978B",
        },
      },
    },
    chart: {
      id: "box-plot",
    },
  };
  const series = [
    {
      data: [
        {
          x: "Type 1",
          y: [40, 51.98, 56.29, 59.59, 63.85],
        },
        {
          x: "Type 2",
          y: [52.76, 57.35, 59.15, 63.03, 67.98],
        },
        {
          x: "Type 3",
          y: [43.66, 44.99, 51.35, 52.95, 59.42],
        },
        {
          x: "Type 4",
          y: [38.66, 44.99, 50.35, 47.95, 54.42],
        },
      ],
    },
  ];
  return (
    <>
      <ChartWrapper
        title="Box Plot"
        options={options}
        series={series}
        type="boxPlot"
      />
    </>
  );
};
//Candlestick chart with dummy data
export const CandleStickChart = () => {
  const options: ApexOptions = {
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#3C90EB",
          downward: "#DF7D46",
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    chart: { id: "candlestick plot" },
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd MMM",
      },
    },
  };
  const series = [
    {
      data: [
        { x: new Date("2026-01-01"), y: [100, 110, 95, 105] },
        { x: new Date("2026-01-02"), y: [105, 115, 100, 112] },
        { x: new Date("2026-01-03"), y: [112, 118, 108, 110] },
        { x: new Date("2026-01-04"), y: [110, 120, 109, 118] },
        { x: new Date("2026-01-05"), y: [118, 125, 115, 115] },
        { x: new Date("2026-01-06"), y: [120, 130, 119, 128] },
        { x: new Date("2026-01-07"), y: [136, 135, 125, 134] },
        { x: new Date("2026-01-08"), y: [132, 140, 130, 138] },
      ],
    },
  ];
  return (
    <>
      <ChartWrapper
        series={series}
        options={options}
        type="candlestick"
        title="CandleStick Chart"
      />
    </>
  );
};
//radarchart
export const RadarChart = () => {
  const options: ApexOptions = {
    labels: ["April", "May", "June", "July", "August", "September"],
    fill: { opacity: 0.2, colors: ["#25ce95", "#3C90EB"] },
    stroke: { show: true, width: 2 },
    markers: { size: 5 },
  };
  const series = [
    {
      name: "Radar Series 1",
      data: [45, 52, 38, 24, 33, 10],
    },
    {
      name: "Radar Series 2",
      data: [26, 21, 20, 6, 8, 15],
    },
  ];
  return (
    <>
      <ChartWrapper
        series={series}
        options={options}
        type="radar"
        title="Radar Chart"
      />
    </>
  );
};
//Heatmap
export const HeatMap = () => {
  const options: ApexOptions = {
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 10, color: "#00A100", name: "low" },
            { from: 11, to: 20, color: "#128FD9", name: "medium" },
            { from: 21, to: 30, color: "#FFB200", name: "high" },
          ],
        },
      },
    },
  };
  const series = [
    {
      name: "Series 1",
      data: [
        { x: "W1", y: 1 },
        { x: "W2", y: 4 },
        { x: "W3", y: 7 },
        { x: "W4", y: 10 },
      ],
    },
    {
      name: "Series 2",
      data: [
        { x: "W1", y: 20 },
        { x: "W2", y: 16 },
        { x: "W3", y: 13 },
        { x: "W4", y: 11 },
      ],
    },
    {
      name: "Series 3",
      data: [
        { x: "W1", y: 21 },
        { x: "W2", y: 23 },
        { x: "W3", y: 26 },
        { x: "W4", y: 30 },
      ],
    },
  ];
  return (
    <>
      <ChartWrapper
        series={series}
        options={options}
        type="heatmap"
        title="HeatMap"
      />
    </>
  );
};
// stackedbarchart
export const StackedBarchart = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { data: roles = [] } = useRole();
  const { data: users = [] } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getItemsPerMonth(users);
        const roleData = getItemsPerMonth(roles);

        setCategories(userData.categories);

        setSeries([
          { name: "Users", data: userData.data },
          { name: "Roles", data: roleData.data },
        ]);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [roles, users]);
  const options: ApexOptions = {
    chart: { id: "stacked-barchart", stacked: true },
    xaxis: { categories },
  };
  return (
    <ChartWrapper
      options={options}
      series={series}
      title="Stacked Bar Chart"
      type="bar"
    />
  );
};

//MutltiAxis Chart
export const MultiAxisChart = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { data: roles = [] } = useRole();
  const { data: users = [] } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = getItemsPerMonth(users);
        const roleData = getItemsPerMonth(roles);

        setCategories(userData.categories);

        setSeries([
          { name: "Users", type: "column", data: userData.data },
          { name: "Roles", type: "line", data: roleData.data },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: { id: "multi-axis-chart" },
    xaxis: { categories },
    yaxis: [
      { title: { text: "Users" } },
      { opposite: true, title: { text: "Roles" } },
    ],
    stroke: { width: [0, 3], curve: "smooth" },
    colors: ["#008FFB", "#FF4560"],
    legend: { position: "top" },
  };
  return (
    <ChartWrapper
      options={options}
      series={series}
      type="line"
      title="Multi Axis Chart"
    />
  );
};
//Scatter Plot
export const ScatterPlot = () => {
  const series = [
    {
      name: "Dummy Data",
      data: [
        { x: 10, y: 15 },
        { x: 20, y: 30 },
        { x: 25, y: 40 },
        { x: 15, y: 30 },
        { x: 30, y: 35 },
        { x: 40, y: 45 },
      ],
    },
  ];
  const options: ApexOptions = {
    chart: { type: "scatter", zoom: { enabled: true } },
    xaxis: { title: { text: "X Values" } },
    yaxis: { title: { text: "Y Values" } },
    markers: { size: 7 },
  };
  return (
    <ChartWrapper
      options={options}
      series={series}
      type="scatter"
      title="Scatter Chart"
    />
  );
};
export const DonutChart = () => {
  const { data: users = [] } = useUser();

  const { labels, series } = getRoleDistribution(users);

  const options: ApexOptions = {
    labels,
    legend: {
      position: "top",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
    colors: [
      "#008FFB",
      "#25ce95",
      "#FEB019",
      "#FF4560",
      "#ca6fd6",
      "#4d32af",
      "#ccd63c",
      "#ecc1c7",
    ],
  };
  return (
    <ChartWrapper
      type="donut"
      title="Donut Chart"
      options={options}
      series={series}
    />
  );
};
export const BubbleChart = () => {
  const series = [
    {
      name: "Dataset 1",
      data: [
        { x: 10, y: 20, z: 15 },
        { x: 15, y: 10, z: 20 },
        { x: 25, y: 30, z: 25 },
        { x: 30, y: 25, z: 18 },
        { x: 40, y: 35, z: 30 },
      ],
    },
    {
      name: "Dataset 2",
      data: [
        { x: 12, y: 18, z: 10 },
        { x: 20, y: 22, z: 22 },
        { x: 28, y: 26, z: 15 },
        { x: 35, y: 30, z: 28 },
        { x: 45, y: 40, z: 35 },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: { type: "bubble", zoom: { enabled: true } },
    xaxis: { title: { text: "X Values" } },
    yaxis: { title: { text: "Y Values" } },
    dataLabels: { enabled: false },
  };
  return (
    <ChartWrapper
      type="bubble"
      title="Bubble Chart"
      options={options}
      series={series}
    />
  );
};
export const PolarAreaChart = () => {
  const { data: users = [] } = useUser();

  const { labels, series } = getRoleDistribution(users);

  const options: ApexOptions = {
    labels,
    stroke: {
      colors: [
        "#008FFB",
        "#25ce95",
        "#FEB019",
        "#FF4560",
        "#ca6fd6",
        "#4d32af",
        "#ccd63c",
        "#ecc1c7",
      ],
    },
    fill: { opacity: 0.8 },
    legend: { position: "top" },
  };

  return (
    <ChartWrapper
      type="polarArea"
      title="Polar Area Chart"
      options={options}
      series={series}
    />
  );
};
export const RangeBarChart = () => {
  const series = [
    {
      name: "Users",
      data: [
        { x: "Jan", y: [10, 20] },
        { x: "Feb", y: [15, 25] },
        { x: "Mar", y: [20, 30] },
        { x: "Apr", y: [18, 28] },
        { x: "May", y: [22, 35] },
      ],
    },
  ];

  const options: ApexOptions = {
    chart: { type: "rangeBar" },
    plotOptions: {
      bar: { horizontal: false },
    },
  };

  return (
    <ChartWrapper
      type="rangeBar"
      title="Range Bar Chart"
      options={options}
      series={series}
    />
  );
};
export const GroupedHorizontalBarChart = () => (
  <ChartWrapper
    type="bar"
    title="Grouped Horizontal"
    series={[
      { name: "A", data: [10, 20, 30] },
      { name: "B", data: [15, 25, 35] },
    ]}
    options={{
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: ["Jan", "Feb", "Mar"] },
    }}
  />
);
export const RadialBarChart = () => (
  <ChartWrapper
    type="radialBar"
    title="Radial Bar Chart"
    series={[70, 55, 40, 85]}
    options={{
      labels: ["Users", "Roles", "Admins", "Guests"],
    }}
  />
);
