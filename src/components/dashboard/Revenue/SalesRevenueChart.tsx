"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useTheme as useNextTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesRevenueChart = () => {
  const { theme } = useNextTheme();
  const isDark = theme === "dark";

  const labels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: [40, 35, 45, 65, 35, 30, 35, 40, 45, 35, 45],
        borderColor: isDark ? "#60A5FA" : "#1E40AF",
        backgroundColor: isDark ? "#60A5FA" : "#1E40AF",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: isDark ? "#60A5FA" : "#1E40AF",
        pointBorderColor: isDark ? "#1F2937" : "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Rides",
        data: [35, 45, 35, 30, 40, 35, 45, 40, 45, 35, 40],
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#F59E0B",
        pointBorderColor: isDark ? "#1F2937" : "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDark ? "#1F2937" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#9CA3AF" : "#666",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          color: isDark ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.6)",
          lineWidth: 1,
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#666",
          padding: 10,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="h-[300px]">
      <Line options={options} data={data} />
    </div>
  );
};

export default SalesRevenueChart;
