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
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Activity,
  Zap,
} from "lucide-react";
import DashboardHeader from "../DashboardHeader/Header";


type TimeRange = "day" | "week" | "month" | "quarter";

// Color Palette
const CHART_COLORS = {
  primary: "#3b82f6",     // Vibrant Blue
  secondary: "#10b981",   // Emerald Green
  tertiary: "#f43f5e",    // Rose Red
  background: "#f8fafc",  // Soft Blue-Gray Background
  text: {
    heading: "#0f172a",
    subheading: "#64748b",
    muted: "#94a3b8",
  },
};

const TIME_PERIODS = ["Today", "This Week", "This Month", "This Year"];

const roleData = [
  { name: "Riders", value: 63, color: CHART_COLORS.primary },
  { name: "Drivers", value: 25, color: CHART_COLORS.secondary },
];

const NewDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  const refreshData = () => {
    // Refresh data from API
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <DashboardHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        refreshData={refreshData}
      />
        <header className="flex justify-between items-center mb-10 bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Hello, Robert 👋
            </h1>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2.5 w-72 rounded-xl border-2 border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center font-medium rounded-full animate-pulse">
                3
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                RA
              </div>
              <div className="group-hover:bg-blue-50 p-2 rounded-lg transition-colors">
                <p className="font-semibold text-slate-800">Robert Allen</p>
                <p className="text-sm text-slate-500">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="grid grid-cols-2 gap-6">
            <StatsCard
              title="Total Users"
              value="560"
              change={12}
              icon={<Users className="w-6 h-6 text-blue-500" />}
              trend="up"
            />
            <StatsCard
              title="User Experience"
              value="470"
              change={-8}
              icon={<Activity className="w-6 h-6 text-rose-500" />}
              trend="down"
            />
            <StatsCard
              title="Payment Methods"
              value="5"
              icon={<CreditCard className="w-6 h-6 text-green-500" />}
            />
            <StatsCard
              title="Total Vehicles"
              value="250"
              change={12}
              icon={<Car className="w-6 h-6 text-purple-500" />}
              trend="up"
            />
          </div>

          <Card className="shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white p-6">
              <CardTitle className="text-xl font-bold text-slate-800">
                Role Distribution
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Active users by role
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      innerRadius={60}
                      outerRadius={80}
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
              </div>
              <div className="flex justify-center gap-6 mt-4 pb-4">
                {roleData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-md"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-600">
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <Card className="shadow-lg rounded-2xl mb-10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white p-6">
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" /> Rides Overview
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Daily statistics</p>
            </div>
            <select
              className="p-2 pl-4 pr-8 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {TIME_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getRidesData()}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="riders"
                    fill={CHART_COLORS.primary}
                    stackId="stack"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="drivers"
                    fill={CHART_COLORS.secondary}
                    stackId="stack"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    fill={CHART_COLORS.tertiary}
                    stackId="stack"
                    radius={[8, 8, 0, 0]}
                  />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
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
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
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
                      <td className="py-4 px-4 text-slate-600">{user.role}</td>
                      <td className="py-4 px-4 text-slate-600">
                        {user.gender}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{user.rides}</td>
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
  );
};

// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

const StatsCard = ({ title, value, change, icon, trend }: StatsCardProps) => {
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

export default NewDashboard;
