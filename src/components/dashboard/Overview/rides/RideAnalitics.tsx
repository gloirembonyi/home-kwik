"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  CreditCard,
  TrendingUp,
  Users,
  Star,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";
import { LineChart as CustomLineChart } from "./charts/Line";
import { ProfitBarChart } from "./charts/bar";

// data generation function
const generateChartData = (period: string) => {
  const baseData = {
    Today: {
      lineData: [
        { name: "6am", rides: 5, revenue: 3.5 },
        { name: "9am", rides: 12, revenue: 8.4 },
        { name: "12pm", rides: 8, revenue: 5.6 },
        { name: "3pm", rides: 15, revenue: 10.5 },
        { name: "6pm", rides: 10, revenue: 7 },
        { name: "9pm", rides: 18, revenue: 12.6 },
      ],
      barData: [
        { name: "Rides", value: 0 },
        { name: "Profit", value: 0 },
      ],
    },
    "This Week": {
      lineData: [
        { name: "Mon", rides: 20, revenue: 14 },
        { name: "Tue", rides: 25, revenue: 17.5 },
        { name: "Wed", rides: 22, revenue: 15.4 },
        { name: "Thu", rides: 30, revenue: 21 },
        { name: "Fri", rides: 28, revenue: 19.6 },
        { name: "Sat", rides: 35, revenue: 24.5 },
        { name: "Sun", rides: 32, revenue: 22.4 },
      ],
      barData: [
        { name: "Gross", value: 0 },
        { name: "Net", value: 0 },
      ],
    },
    "This Month": {
      lineData: [
        { name: "Jan", rides: 0, revenue: 0 },
        { name: "Feb", rides: 0, revenue: 0 },
        { name: "Mar", rides: 0, revenue: 0 },
        { name: "Apr", rides: 0, revenue: 0 },
        { name: "May", rides: 0, revenue: 0 },
        { name: "Jun", rides: 0, revenue: 0 },
        { name: "Jul", rides: 0, revenue: 0 },
        { name: "Aug", rides: 0, revenue: 0 },
        { name: "Sep", rides: 0, revenue: 0 },
        { name: "Oct", rides: 0, revenue: 0 },
        { name: "Nov", rides: 0, revenue: 0 },
        { name: "Dec", rides: 0, revenue: 0 },
      ],
      barData: [
        { name: "Rides", value: 0 },
        { name: "Profit", value: 0 },
      ],
    },
    "This Year": {
      lineData: [
        { name: "Q1", rides: 0, revenue: 0 },
        { name: "Q2", rides: 0, revenue: 0 },
        { name: "Q3", rides: 0, revenue: 0 },
        { name: "Q4", rides: 0, revenue: 0 },
        { name: "Q5", rides: 0, revenue: 0 },
        { name: "Q6", rides: 0, revenue: 0 },
      ],
      barData: [
        { name: "Annual Rides", value: 0 },
        { name: "Annual Profit", value: 0 },
      ],
    },
  };

  return baseData[period as keyof typeof baseData] || baseData["This Month"];
};

// Stat Card Component with Enhanced Design
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: {
    percentage: number;
    direction: "up" | "down";
  };
}) => (
  <Card className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2 rounded-full">
            <Icon className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {value}
        </p>
        <div
          className={`flex items-center text-sm font-semibold ${
            trend.direction === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend.direction === "up" ? (
            <ArrowUpRight className="mr-1" />
          ) : (
            <ArrowUpRight className="mr-1 rotate-180" />
          )}
          {trend.percentage}%{" "}
          {trend.direction === "up" ? "increase" : "decrease"}
        </div>
      </div>
    </div>
  </Card>
);

// Analytics Dashboard
export const AnalyticsPageRide = () => {
  const [timePeriod, setTimePeriod] = useState<string>("This Month");

  const [rides, setRides] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing.");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/ride/rides`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setRides(response.data.data);
      } catch (error) {
        console.error("Fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Cleanup function (optional)
    return () => {
      // Clean up if necessary
    };
  }, []); //
  console.log(rides);

  // Memoized chart data to prevent unnecessary re-renders
  const { lineData, barData } = useMemo(
    () => generateChartData(timePeriod),
    [timePeriod]
  );

  return (
    <div className="bg-gray-50 min-h-screen space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={CreditCard}
          title="Total Revenue"
          value="0 RWF"
          trend={{ percentage: 0, direction: "up" }}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Rides"
          value={(rides?.length ?? 0).toString()}
          trend={{ percentage: 0, direction: "up" }}
        />
        <StatCard
          icon={Users}
          title="Active Drivers"
          value="0"
          trend={{ percentage: 0, direction: "up" }}
        />
        <StatCard
          icon={Star}
          title="Avg. Satisfaction"
          value="0"
          trend={{ percentage: 0, direction: "up" }}
        />
      </div>

      {/* Line Chart Section */}
      <Card className="bg-white shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Rides & Revenue Analytics
            </CardTitle>
            <p className="text-sm text-gray-500">
              Comprehensive performance overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="rounded-md border-gray-300 text-sm text-gray-600 px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <CustomLineChart timePeriod={timePeriod} />
        </CardContent>
      </Card>

      {/* Bar Chart Section */}
      <Card className="bg-white shadow-xl rounded-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Profit Breakdown
            </CardTitle>
            <p className="text-sm text-gray-500">Detailed financial insights</p>
          </div>
          <div className="text-green-500 text-sm font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            +25.3% Growth
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <ProfitBarChart timePeriod={"This Month"} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPageRide;
