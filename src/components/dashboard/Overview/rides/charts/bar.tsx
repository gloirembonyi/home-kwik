import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register all necessary chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ProfitBarChart = ({ timePeriod }: { timePeriod: string }) => {
  // Dynamic data based on time period
  const getChartData = (period: string) => {
    switch (period) {
      case "Today":
        return [50, 80];
      case "This Week":
        return [150, 200];
      case "This Month":
        return [100, 200, 150, 300, 400, 280, 320, 250, 300, 350, 270, 290];
      case "This Year":
        return [
          1200, 1500, 1300, 1600, 1800, 1400, 1700, 1550, 1650, 1750, 1600,
          1900,
        ];
      default:
        return [100, 200, 150, 300, 400, 280, 320, 250, 300, 350, 270, 290];
    }
  };

  const getChartLabels = (period: string) => {
    switch (period) {
      case "Today":
        return ["Rides", "Profit"];
      case "This Week":
        return ["Gross", "Net"];
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

  const barChartData = {
    labels: getChartLabels(timePeriod),
    datasets: [
      {
        label: "Rides",
        data: getChartData(timePeriod),
        backgroundColor: "#4B7BE5",
        barThickness: 20,
        borderRadius: 5,
      },
      {
        label: "Profit",
        data: getChartData(timePeriod).map((val) => val * 0.7),
        backgroundColor: "#10B981",
        barThickness: 20,
        borderRadius: 5,
      },
    ],
  };

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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
        backgroundColor: "#111827",
        titleColor: "#F3F4F6",
        bodyColor: "#F3F4F6",
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            const value = context.raw;
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
            family: "'Inter', sans-serif",
            weight: 400,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(243, 244, 246, 0.6)",
          lineWidth: 1,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 11,
            family: "'Inter', sans-serif",
            weight: 400,
          },
          padding: 12,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[250px] w-full">
      <Bar data={barChartData} options={barChartOptions} className="!p-0" />
    </div>
  );
};
