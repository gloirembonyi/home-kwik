import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  InteractionMode,
} from "chart.js";

// Register all necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChart = ({ timePeriod }: { timePeriod: string }) => {
  // Dynamic data based on time period
  const getChartData = (period: string) => {
    switch (period) {
      case "Today":
        return [5, 12, 8, 15, 10, 18];
      case "This Week":
        return [20, 25, 22, 30, 28, 35, 32];
      case "This Month":
        return [20, 40, 30, 60, 80, 28, 40, 60, 40, 80, 60, 50];
      case "This Year":
        return [100, 120, 110, 150, 200, 180, 220, 240, 210, 250, 230, 270];
      default:
        return [20, 40, 30, 60, 80, 28, 40, 60, 40, 80, 60, 50];
    }
  };

  const getChartLabels = (period: string) => {
    switch (period) {
      case "Today":
        return ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];
      case "This Week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "This Month":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      case "This Year":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
    }
  };

  const lineChartData = {
    labels: getChartLabels(timePeriod),
    datasets: [
      {
        label: "Rides",
        data: getChartData(timePeriod),
        borderColor: "rgba(0, 123, 255, 1)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        pointBackgroundColor: "rgba(0, 123, 255, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgba(0, 123, 255, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        shadowColor: "rgba(0, 123, 255, 0.4)",
        shadowBlur: 10,
      },
      {
        label: "Revenue",
        data: getChartData(timePeriod).map((val) => val * 0.7),
        borderColor: "rgba(40, 167, 69, 1)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        pointBackgroundColor: "rgba(40, 167, 69, 1)",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgba(40, 167, 69, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        shadowColor: "rgba(40, 167, 69, 0.4)",
        shadowBlur: 10,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: "normal" as "normal",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
        onHover: (event: any, legendItem: any, legend: any) => {
          document.body.style.cursor = "pointer";
        },
        onLeave: (event: any, legendItem: any, legend: any) => {
          document.body.style.cursor = "default";
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as "bold",
        },
        bodyFont: {
          size: 12,
        },
        usePointStyle: true,
      },
      title: {
        display: true,
        text: `Analytics for ${timePeriod}`,
        color: "#333",
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: "bold" as "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          position: "bottom" as const,
        },
        ticks: {
          color: "#6B7280",
          font: {
            family: "'Inter', sans-serif",
            weight: "normal" as "normal",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
          borderDash: [5, 5],
        },
        ticks: {
          color: "#6B7280",
          font: {
            family: "'Inter', sans-serif",
            weight: "normal" as "normal",
          },
          callback: function (value: { toLocaleString: () => any }) {
            return value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as InteractionMode,
      intersect: false,
    },
    hover: {
      mode: "nearest" as InteractionMode,
      intersect: true,
    },
    elements: {
      line: {
        capBezierPoints: true,
      },
    },
  };

  return (
    <div className="h-[450px] w-full relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-blue-50/30 rounded-lg"></div>
      <Line
        data={lineChartData}
        options={lineChartOptions}
        className="z-10 relative"
      />
    </div>
  );
};
