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
  <Card className="bg-white shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
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
  const [timePeriod, setTimePeriod] = useState<string>("Today");

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
    <div className="space-y-6">
      {/* Header ride analytics with Stats */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Ride Analytics
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Sort By:
          </span>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-background text-foreground border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <Card className="bg-background/50 backdrop-blur-sm border-border hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">
                Total Revenue
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">152 RWF</h3>
          </CardContent>
        </Card>

        {/* Total Rides Card */}
        <Card className="bg-background/50 backdrop-blur-sm border-border hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Rides</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">100</h3>
          </CardContent>
        </Card>

        {/* Active Drivers Card */}
        <Card className="bg-background/50 backdrop-blur-sm border-border hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">
                Active Drivers
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">321</h3>
          </CardContent>
        </Card>

        {/* Average Satisfaction Card */}
        <Card className="bg-background/50 backdrop-blur-sm border-border hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">
                Average Satisfaction
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">32.1 RWF</h3>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart Section */}
      <Card className="bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Analytics
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CustomLineChart timePeriod={timePeriod} />
        </CardContent>
      </Card>

      {/* Sort Section */}
      <div className="flex justify-end my-6">
        <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm border border-border rounded-lg px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">
            Sort Analytics By:
          </span>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-transparent text-foreground border-none focus:outline-none focus:ring-0 text-sm font-medium cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </div>
      </div>

      {/* Bar Chart Section */}
      <Card className="bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              Profit Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed financial insights
            </p>
          </div>
          <div className="text-emerald-500 text-sm font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            +25.3% Growth
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ProfitBarChart timePeriod={timePeriod} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPageRide;
