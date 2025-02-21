"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Users,
  CreditCard,
  Car,
  TrendingUp,
  TrendingDown,
  Info,
  RefreshCw,
  Filter,
} from "lucide-react";

// Define an interface for the StatsCard props
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  change?: number;
  trend?: "up" | "down";
  lastUpdate?: string;
  color: {
    light: string;
    dark: string;
    gradient: string;
  };
  description: string;
  chartData: Array<Record<string, string | number>>;
}

// Enhanced Color Palette
const COLORS = {
  primary: {
    light: "#132e6d",
    dark: "#1d4ed8",
    gradient: "from-blue-100 to-blue-200",
  },
  secondary: {
    light: "#85d0fa",
    dark: "#047857",
    gradient: "from-green-100 to-green-200",
  },
  tertiary: {
    light: "#e2656d",
    dark: "#b91c1c",
    gradient: "from-red-100 to-red-200",
  },
  quaternary: {
    light: "#f59e0b",
    dark: "#d97706",
    gradient: "from-yellow-100 to-yellow-200",
  },
};

// Expanded Data Structures
const statsData: StatsCardProps[] = [
  {
    title: "Total Users",
    value: "560",
    icon: Users,
    change: 12,
    trend: "up",
    lastUpdate: "November 14, 2024",
    color: COLORS.primary,
    description: "Total registered platform users",
    chartData: [
      { month: "Jan", users: 420 },
      { month: "Feb", users: 480 },
      { month: "Mar", users: 560 },
    ],
  },
  {
    title: "User Experience",
    value: "470",
    icon: Users,
    change: 8,
    trend: "down",
    lastUpdate: "November 14, 2024",
    color: COLORS.tertiary,
    description: "Average user satisfaction score",
    chartData: [
      { month: "Jan", score: 510 },
      { month: "Feb", score: 490 },
      { month: "Mar", score: 470 },
    ],
  },
  {
    title: "Payment Methods",
    value: "5",
    icon: CreditCard,
    lastUpdate: "November 14, 2024",
    color: COLORS.secondary,
    description: "Available payment options",
    chartData: [
      { method: "Credit", value: 2 },
      { method: "Debit", value: 1 },
      { method: "PayPal", value: 1 },
      { method: "Others", value: 1 },
    ],
  },
  {
    title: "Total Vehicles",
    value: "250",
    icon: Car,
    change: 12,
    trend: "up",
    lastUpdate: "November 14, 2024",
    color: COLORS.quaternary,
    description: "Registered vehicles on platform",
    chartData: [
      { month: "Jan", vehicles: 180 },
      { month: "Feb", vehicles: 220 },
      { month: "Mar", vehicles: 250 },
    ],
  },
];

const roleData = [
  {
    name: "Riders",
    value: 0,
    color: COLORS.primary.light,
    description: "Active app users seeking transportation",
  },
  {
    name: "Drivers",
    value: 1,
    color: COLORS.secondary.light,
    description: "Registered drivers providing services",
  },
  {
    name: "Pending",
    value: 0,
    color: COLORS.tertiary.light,
    description: "Users in verification process",
  },
];

// Enhanced Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend,
  lastUpdate,
  color,
  description,
  chartData,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card
      className={`
        relative overflow-hidden rounded-3xl 
        transition-all duration-300 
        hover:shadow-2xl hover:scale-105
        bg-card
      `}
    >
      <CardHeader className="relative p-6">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="hover:bg-accent rounded-full p-2 transition-colors"
          >
            <Info className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="p-2 bg-accent/50 rounded-full">
            <Icon className={`w-6 h-6 text-foreground`} />
          </div>
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground leading-tight">
                {value}
              </div>
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {trend === "up" ? (
                  <TrendingUp className="text-green-600 dark:text-green-400 w-5 h-5" />
                ) : (
                  <TrendingDown className="text-red-600 dark:text-red-400 w-5 h-5" />
                )}
                <span
                  className={`font-semibold ${
                    trend === "up"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {change}%
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-border"></div>

          <p className="text-xs text-muted-foreground">
            Last Update: {lastUpdate}
          </p>
        </div>

        {showDetails && (
          <div className="absolute inset-0 bg-background/95 dark:bg-background/95 p-4 z-10">
            <h4 className="font-semibold text-foreground">{description}</h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey={Object.keys(chartData[0])[0]}
                  tick={{ fill: "var(--foreground)" }}
                />
                <Bar
                  dataKey={Object.keys(chartData[0])[1]}
                  fill={color.light}
                />
              </BarChart>
            </ResponsiveContainer>
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-2 right-2 hover:bg-accent rounded-full p-2"
            >
              ✕
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Role Distribution Chart
const RoleDistributionChart = () => {
  const [activeSegment, setActiveSegment] = useState(null);

  return (
    <Card className="rounded-3xl overflow-hidden shadow-xl bg-card">
      <CardHeader className="bg-gradient-to-r from-accent to-background p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-foreground">
            Role Usage
          </CardTitle>
          <div className="flex space-x-2">
            <button className="hover:bg-accent p-2 rounded-full transition-colors">
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="hover:bg-accent p-2 rounded-full transition-colors">
              <Filter className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              labelLine={false}
              onMouseEnter={(data) => setActiveSegment(data.name)}
              onMouseLeave={() => setActiveSegment(null)}
            >
              {roleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={
                    activeSegment === null || activeSegment === entry.name
                      ? 1
                      : 0.5
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
          {roleData.map((entry) => (
            <div
              key={entry.name}
              className={`
              flex items-center gap-2 p-2 rounded-lg 
              transition-all duration-300 
                ${activeSegment === entry.name ? "bg-accent shadow-md" : ""}
            `}
            >
              <div
                className="w-4 h-4 rounded-full shadow-md"
                style={{ backgroundColor: entry.color }}
              />
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {entry.name}: {entry.value}%
                </span>
                {activeSegment === entry.name && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
export const StatsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-6">
        {/* StatsData Section */}
        <div className="col-span-4 grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} icon={stat.icon} />
            ))}
          </div>
        </div>

        {/* RoleDistributionChart Section */}
        <div className="col-span-2">
          <RoleDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
