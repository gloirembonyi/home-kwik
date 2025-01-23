import React, { useState, useMemo } from "react";
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
  CartesianGrid,
  ComposedChart,
} from "recharts";

const CHART_COLORS = {
  riders: "#132e6d", // Dark navy blue from image
  drivers: "#fdb022", // Golden yellow from image
  cancelled: "#ff6b6b", // Coral red from image
  background: {
    light: "var(--background)",
    dark: "var(--card)",
  },
  text: {
    heading: "var(--foreground)",
    subheading: "var(--muted-foreground)",
    muted: "var(--muted)",
  },
};

const getRidesData = [
  {
    day: "Mon",
    riders: 60,
    drivers: 25,
    cancelled: 15,
    totalRides: 100,
    percentage: {
      riders: "60%",
      drivers: "25%",
      cancelled: "15%",
    },
  },
  {
    day: "Tue",
    riders: 60,
    drivers: 20,
    cancelled: 20,
    totalRides: 100,
    percentage: {
      riders: "60%",
      drivers: "20%",
      cancelled: "20%",
    },
  },
  {
    day: "Wed",
    riders: 45,
    drivers: 30,
    cancelled: 25,
    totalRides: 100,
    percentage: {
      riders: "45%",
      drivers: "30%",
      cancelled: "25%",
    },
  },
  {
    day: "Thu",
    riders: 60,
    drivers: 25,
    cancelled: 15,
    totalRides: 100,
    percentage: {
      riders: "60%",
      drivers: "25%",
      cancelled: "15%",
    },
  },
  {
    day: "Fri",
    riders: 75,
    drivers: 15,
    cancelled: 10,
    totalRides: 100,
    percentage: {
      riders: "75%",
      drivers: "15%",
      cancelled: "10%",
    },
  },
  {
    day: "Sat",
    riders: 45,
    drivers: 30,
    cancelled: 25,
    totalRides: 100,
    percentage: {
      riders: "45%",
      drivers: "30%",
      cancelled: "25%",
    },
  },
  {
    day: "Sun",
    riders: 48,
    drivers: 32,
    cancelled: 20,
    totalRides: 100,
    percentage: {
      riders: "48%",
      drivers: "32%",
      cancelled: "20%",
    },
  },
];

const RidesOverviewChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [filterType, setFilterType] = useState("All");

  // Function to calculate demand-based data
  const calculateDemandData = (data: typeof getRidesData, type: string) => {
    if (type === "High Demand") {
      return data.map((item) => ({
        ...item,
        riders: Math.min(Math.round(item.riders * 1.3), 100),
        drivers: Math.min(Math.round(item.drivers * 1.2), 100),
        cancelled: Math.max(Math.round(item.cancelled * 0.8), 0),
      }));
    } else if (type === "Low Demand") {
      return data.map((item) => ({
        ...item,
        riders: Math.max(Math.round(item.riders * 0.7), 0),
        drivers: Math.max(Math.round(item.drivers * 0.8), 0),
        cancelled: Math.min(Math.round(item.cancelled * 1.2), 100),
      }));
    }
    return data;
  };

  const filteredData = useMemo(
    () => calculateDemandData(getRidesData, filterType),
    [filterType]
  );

  return (
    <Card className="shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-card p-6 border-b border-border">
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Rides Overview
          </CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort By:</span>
            <select
              className="appearance-none pl-4 pr-8 py-2 text-sm 
              bg-background border border-border rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-primary/30 
              cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-md text-foreground"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              barGap={2} // Minimal gap between bars in same group
              barCategoryGap={40} // Larger gap between day groups
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
                opacity={0.4}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "currentColor",
                  fontSize: 12,
                  opacity: 1,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "currentColor",
                  fontSize: 12,
                  opacity: 1,
                }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-foreground mb-2">
                          {payload[0].payload.day}
                        </p>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.fill }}
                            />
                            <span className="text-muted-foreground">
                              {entry.name}:
                            </span>
                            <span className="font-semibold text-foreground">
                              {entry.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="riders"
                fill={CHART_COLORS.riders}
                radius={[4, 4, 4, 4]}
                maxBarSize={12}
                stackId="stack"
              />
              <Bar
                dataKey="drivers"
                fill={CHART_COLORS.drivers}
                radius={[4, 4, 4, 4]}
                maxBarSize={12}
                stackId="stack"
              />
              <Bar
                dataKey="cancelled"
                fill={CHART_COLORS.cancelled}
                radius={[4, 4, 4, 4]}
                maxBarSize={12}
                stackId="stack"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidesOverviewChart;
