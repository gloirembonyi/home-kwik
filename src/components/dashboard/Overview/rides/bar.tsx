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
} from 'chart.js';

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
    switch(period) {
      case 'Today':
        return [50, 80];
      case 'This Week':
        return [150, 200];
      case 'This Month':
        return [100, 200, 150, 300, 400, 280, 320, 250, 300, 350, 270, 290];
      case 'This Year':
        return [1200, 1500, 1300, 1600, 1800, 1400, 1700, 1550, 1650, 1750, 1600, 1900];
      default:
        return [100, 200, 150, 300, 400, 280, 320, 250, 300, 350, 270, 290];
    }
  };

  const getChartLabels = (period: string) => {
    switch(period) {
      case 'Today':
        return ['Rides', 'Profit'];
      case 'This Week':
        return ['Gross', 'Net'];
      case 'This Month':
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      case 'This Year':
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      default:
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
  };

  const barChartData = {
    labels: getChartLabels(timePeriod),
    datasets: [
      {
        label: "Rides",
        data: getChartData(timePeriod),
        backgroundColor: "#3B82F6",
        barThickness: 20,
        borderRadius: 5,
      },
      {
        label: "Profit",
        data: getChartData(timePeriod).map(val => val * 0.7),
        backgroundColor: "#6B7280",
        barThickness: 20,
        borderRadius: 5,
      },
    ],
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const, // Add type assertion
        labels: {
          color: "#6B7280",
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: 'white',
        bodyColor: 'white'
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: "#6B7280",
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...getChartData(timePeriod)) * 1.2
      }
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
};

