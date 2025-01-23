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
} from "chart.js";

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
  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Rides",
        data: [20, 35, 55, 45, 35, 75, 35, 35, 55, 70, 55, 50],
        borderColor: "#4B7BE5",
        backgroundColor: "rgba(75, 123, 229, 0.05)",
        pointBackgroundColor: "#4B7BE5",
        pointBorderColor: "#1F2937",
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#4B7BE5",
        pointHoverBorderColor: "#1F2937",
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Revenue",
        data: [25, 35, 45, 70, 40, 40, 45, 30, 35, 30, 45, 65],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        pointBackgroundColor: "#10B981",
        pointBorderColor: "#1F2937",
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#10B981",
        pointHoverBorderColor: "#1F2937",
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 6,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#9CA3AF",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: 400,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        borderColor: "#374151",
        borderWidth: 1,
        callbacks: {
          title: () => "23 June 2022",
          label: (context: any) => {
            return context.dataset.label === "Rides"
              ? " Rides - 28"
              : " Revenue - 77k";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          borderWidth: 0,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
            weight: 400,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(75, 85, 99, 0.15)",
          lineWidth: 1,
          borderWidth: 0,
        },
        ticks: {
          stepSize: 20,
          color: "#9CA3AF",
          font: {
            size: 11,
            weight: 400,
          },
          padding: 12,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as "index",
    },
  };

  return (
    <div className="h-[250px] w-full">
      <Line data={data} options={options} className="!p-0" />
    </div>
  );
};
