import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";

const data = [
  { name: "Jan", value: 43.5, trend: "+2.45%" },
  { name: "Feb", value: 45.2, trend: "+2.45%" },
  { name: "Mar", value: 42.8, trend: "+2.45%" },
  { name: "Apr", value: 48.8, trend: "+2.45%" },
  { name: "May", value: 45.5, trend: "+2.45%" },
  { name: "Jun", value: 50.0, trend: "+2.45%" },
  { name: "Jul", value: 52.2, trend: "+2.45%" },
  { name: "Aug", value: 54.8, trend: "+2.45%" },
  { name: "Sep", value: 52.4, trend: "-4.75%" },
  { name: "Oct", value: 50.0, trend: "-4.75%" },
  { name: "Nov", value: 48.8, trend: "-4.75%" },
  { name: "Dec", value: 52.4, trend: "-4.75%" },
];

const GradientLineChart = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-1xl font-bold text-foreground">Today's Stats</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              On track
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-card/50 rounded-xl p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Description</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">43.50%</span>
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              +2.45%
            </span>
          </div>
        </div>
        <div className="bg-card/50 rounded-xl p-6 space-y-2">
          <p className="text-sm text-muted-foreground">Description</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">$52,422</span>
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              -4.75%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[150px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.2}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#1d4ed8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradientLineChart;
