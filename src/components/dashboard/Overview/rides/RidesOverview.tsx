import React, { useState, useMemo, useCallback } from "react";
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
  Legend,
  ComposedChart,
  Line,
  TooltipProps,
} from "recharts";
import {
  Zap,
  ChevronDown,
  Users,
  Car,
  Clock,
  TrendingUp,
  Filter,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";

// Color Palette with More Depth
const CHART_COLORS = {
  primary: {
    main: "#3b82f6", // Bright blue
    light: "#60a5fa",
  },
  secondary: {
    main: "#10b981", // Emerald green
    light: "#34d399",
  },
  tertiary: {
    main: "#f43f5e", // Rose red
    light: "#fb7185",
  },
  accent: {
    success: "#22c55e", // Green
    warning: "#f59e0b", // Amber
  },
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

const TIME_PERIODS = [
  "Today",
  "This Week",
  "This Month",
  "This Quarter",
  "This Year",
];

const RidesOverviewChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [filterType, setFilterType] = useState("All");

  const getRidesData = useMemo(() => {
    const baseData = [
      {
        day: "Mon",
        riders: 60,
        drivers: 25,
        cancelled: 15,
        totalRides: 100,
        averageRating: 4.5,
        peakHours: [7, 18],
        topRoutes: ["Downtown", "Airport"],
      },
      {
        day: "Tue",
        riders: 58,
        drivers: 20,
        cancelled: 22,
        totalRides: 100,
        averageRating: 4.3,
        peakHours: [8, 17],
        topRoutes: ["University", "Business District"],
      },
      {
        day: "Wed",
        riders: 45,
        drivers: 25,
        cancelled: 30,
        totalRides: 100,
        averageRating: 4.2,
        peakHours: [6, 19],
        topRoutes: ["Shopping Mall", "Suburbs"],
      },
      {
        day: "Thu",
        riders: 60,
        drivers: 30,
        cancelled: 10,
        totalRides: 100,
        averageRating: 4.6,
        peakHours: [7, 20],
        topRoutes: ["Tech Park", "Residential Area"],
      },
      {
        day: "Fri",
        riders: 75,
        drivers: 20,
        cancelled: 5,
        totalRides: 100,
        averageRating: 4.7,
        peakHours: [5, 22],
        topRoutes: ["Night Out Areas", "Entertainment District"],
      },
      {
        day: "Sat",
        riders: 45,
        drivers: 35,
        cancelled: 20,
        totalRides: 100,
        averageRating: 4.4,
        peakHours: [10, 23],
        topRoutes: ["Tourist Spots", "Shopping Centers"],
      },
      {
        day: "Sun",
        riders: 48,
        drivers: 32,
        cancelled: 20,
        totalRides: 100,
        averageRating: 4.1,
        peakHours: [11, 20],
        topRoutes: ["Leisure Areas", "Restaurants"],
      },
    ];

    // Intelligent Filtering Logic
    return baseData.map((item) => {
      switch (filterType) {
        case "High Demand":
          return {
            ...item,
            riders: Math.min(item.riders * 1.5, 100),
            drivers: Math.min(item.drivers * 1.2, 50),
            totalRides: Math.min(item.totalRides * 1.3, 130),
          };
        case "Low Demand":
          return {
            ...item,
            riders: Math.max(item.riders * 0.7, 30),
            drivers: Math.max(item.drivers * 0.8, 15),
            totalRides: Math.max(item.totalRides * 0.7, 70),
          };
        default:
          return item;
      }
    });
  }, [filterType]);

  // Performance Insights Calculation
  const performanceInsights = useMemo(() => {
    const totalRides = getRidesData.reduce(
      (sum, day) => sum + day.totalRides,
      0
    );
    const averageRides = totalRides / getRidesData.length;
    const peakDay = getRidesData.reduce((prev, current) =>
      prev.totalRides > current.totalRides ? prev : current
    );
    return {
      totalRides,
      averageRides,
      peakDay: peakDay.day,
      topRoute: peakDay.topRoutes[0],
      averageRating: peakDay.averageRating,
    };
  }, [getRidesData]);

  // Tooltip Customization
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card shadow-2xl rounded-xl p-4 border border-border space-y-2">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            <span className="font-semibold text-foreground">{data.day}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Users
                className="w-5 h-5 mr-2"
                style={{ color: CHART_COLORS.primary.main }}
              />
              <span className="text-foreground">Riders: {data.riders}</span>
            </div>
            <div className="flex items-center">
              <Car
                className="w-5 h-5 mr-2"
                style={{ color: CHART_COLORS.secondary.main }}
              />
              <span className="text-foreground">Drivers: {data.drivers}</span>
            </div>
            <div className="flex items-center">
              <Clock
                className="w-5 h-5 mr-2"
                style={{ color: CHART_COLORS.tertiary.main }}
              />
              <span className="text-foreground">
                Cancelled: {data.cancelled}
              </span>
            </div>
            <div className="flex items-center">
              <Star
                className="w-5 h-5 mr-2"
                style={{ color: CHART_COLORS.accent.warning }}
              />
              <span className="text-foreground">
                Avg Rating: {data.averageRating}
              </span>
            </div>
            <div className="flex items-center col-span-2">
              <MapPin
                className="w-5 h-5 mr-2"
                style={{ color: CHART_COLORS.accent.success }}
              />
              <span className="text-foreground">
                Top Routes: {data.topRoutes.join(", ")}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-2xl rounded-3xl overflow-hidden border-none">
      <CardHeader className="flex flex-row items-center justify-between bg-card p-6 border-b border-border">
        <div>
          <CardTitle className="text-2xl font-extrabold text-foreground flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-primary stroke-[2.5]" />
            Rides Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Mobility Insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              className="appearance-none w-full pl-4 pr-10 py-2 text-sm 
              bg-background border border-border rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-primary/30 
              cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-md flex items-center text-foreground"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Rides</option>
              <option value="High Demand">High Demand</option>
              <option value="Low Demand">Low Demand</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 -translate-y-1/2 
              text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <select
              className="appearance-none w-full pl-4 pr-10 py-2 text-sm 
              bg-background border border-border rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-primary/30 
              cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-md text-foreground"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {TIME_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 
              text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-card">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getRidesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                content={
                  <CustomTooltip active={undefined} payload={undefined} />
                }
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              {/* Stacked Bars */}
              <Bar
                dataKey="riders"
                fill={CHART_COLORS.primary.main}
                stackId="stack"
                radius={[18, 18, 18, 18]}
                barSize={40}
              />
              <Bar
                dataKey="drivers"
                fill={CHART_COLORS.secondary.main}
                stackId="stack"
                radius={[18, 18, 18, 18]}
                barSize={40}
              />
              <Bar
                dataKey="cancelled"
                fill={CHART_COLORS.tertiary.main}
                stackId="stack"
                radius={[18, 18, 18, 18]}
                barSize={40}
              />
              {/* Trend Line */}
              <Line
                type="monotone"
                dataKey="totalRides"
                stroke={CHART_COLORS.accent.success}
                strokeWidth={3}
                dot={{ r: 5, fill: CHART_COLORS.background.light }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "0.875rem",
                  color: "var(--foreground)",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Performance Summary */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4 bg-card rounded-2xl p-4 shadow-md border border-border">
          <div className="text-center border-r border-border pr-4">
            <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Total Rides
            </p>
            <p className="text-xl font-bold text-foreground">
              {performanceInsights.totalRides}
            </p>
          </div>
          <div className="text-center border-r border-border pr-4">
            <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Peak Performance
            </p>
            <p className="text-xl font-bold text-foreground">
              {performanceInsights.peakDay}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Top Route
            </p>
            <p className="text-xl font-bold text-foreground">
              {performanceInsights.topRoute}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RidesOverviewChart;
