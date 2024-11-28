"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  CreditCard,
  Car,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import NewSidebar from "@/components/dashboard/Overview/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";
import ProSidebar from "@/components/dashboard/Overview/sidebar";
import RidesOverviewChart from "./RidesOverview";
import StatsDashboard from "./StatsDashboard";

// Enhanced Color Palette
const CHART_COLORS = {
  primary: "#122d6c",
  secondary: "#f2ba6a",
  tertiary: "#e1646c",
  background: "#f8fafc",
  text: {
    heading: "#0f172a",
    subheading: "#64748b",
    muted: "#94a3b8",
  },
};

type TimeRange = "day" | "week" | "month" | "quarter";

const TIME_PERIODS = ["Today", "This Week", "This Month", "This Year"];

const roleData = [
  { name: "Riders", value: 63, color: CHART_COLORS.primary },
  { name: "Drivers", value: 25, color: CHART_COLORS.secondary },
];

const OverviewDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const refreshData = () => {
    // Implement data refresh logic
  };

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    // Add any additional navigation logic
    console.log(`Navigating to: ${path}`);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex">
      {/* <ProSidebar
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onCollapseChange={handleSidebarCollapse}
      /> */}

      <div
        className=" flex-1 
        transition-all 
        duration-300 
        ease-in-out "
      >
        {/* <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
          <DashboardHeader
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            refreshData={refreshData}
          />
        </div> */}

        <main className="space-y-6">
          {/* Stats Grid */}
          {/* <div className="grid grid-cols-3 gap-6">
            <StatsCard
              title="Total Users"
              value="560"
              icon={<Users className="w-6 h-6 text-blue-500" />}
              change={12}
              trend="up"
              lastUpdate="Nov 14"
            />
            <StatsCard
              title="User Experience"
              value="470"
              icon={<Users className="w-6 h-6 text-red-500" />}
              change={-8}
              trend="down"
              lastUpdate="Nov 14"
            />
            <StatsCard
              title="Payment Methods"
              value="5"
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
              lastUpdate="Nov 14"
            />
            <StatsCard
              title="Total Vehicles"
              value="250"
              icon={<Car className="w-6 h-6 text-yellow-500" />}
              change={12}
              trend="up"
              lastUpdate="Nov 14"
            />
            <div className="col-span-2">
              <Card className="shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white px-6 py-4">
                  <CardTitle className="text-xl font-bold text-slate-800">Role Distribution</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Active users by role</p>
                </CardHeader>
                <CardContent className="pt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <div className="flex justify-center gap-4 py-4">
                  {roleData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-md" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-slate-600">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div> */}
          <StatsDashboard />

          {/* Rides Overview Chart */}
          <RidesOverviewChart />

          {/* Frequent Users Table */}
          <Card className="shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white p-6">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Frequent Users
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Users with highest ride counts
                </p>
              </div>
              <button className="text-blue-600 text-sm hover:underline font-semibold">
                View All Users
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-200">
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        User Name
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Role
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Gender
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Total Rides
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFrequentUsers().map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center text-white font-semibold shadow-md">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium text-slate-800">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.role}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.gender}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.rides}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                            ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  lastUpdate: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  trend,
  lastUpdate,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-white p-4">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className="text-slate-500">{icon}</div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm
            ${trend === "up" ? "text-green-500" : "text-red-500"}`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">{lastUpdate}</p>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getRidesData = () => [
  { day: "Mon", riders: 60, drivers: 25, pending: 15 },
  { day: "Tue", riders: 58, drivers: 20, pending: 22 },
  { day: "Wed", riders: 45, drivers: 25, pending: 30 },
  { day: "Thu", riders: 60, drivers: 30, pending: 10 },
  { day: "Fri", riders: 75, drivers: 20, pending: 5 },
  { day: "Sat", riders: 45, drivers: 35, pending: 20 },
  { day: "Sun", riders: 48, drivers: 32, pending: 20 },
];

const getFrequentUsers = () => [
  {
    name: "Leasie Watson",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
  {
    name: "Darlene Robertson",
    role: "Driver",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Jacob Jones",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Kathryn Murphy",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Leslie Alexander",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
  {
    name: "Ronald Richards",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Jenny Wilson",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
];

export default OverviewDashboard;
