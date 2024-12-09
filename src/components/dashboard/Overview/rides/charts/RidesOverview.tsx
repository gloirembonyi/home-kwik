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
  Star
} from "lucide-react";

// Color Palette with More Depth
const CHART_COLORS = {
  primary: {
    main: "#132e6d",  // Deep Blue
    light: "#3b82f6", // Lighter Blue
  },
  secondary: {
    main: "#f3bb6b",  // Amber
    light: "#fbbf24", // Light Amber
  },
  tertiary: {
    main: "#e2656d",  // Red
    light: "#ef4444", // Light Red
  },
  accent: {
    success: "#16a34a", // Green
    warning: "#ea580c", // Orange
  },
  background: {
    light: "#f8fafc",
    dark: "#f1f5f9",
  },
  text: {
    heading: "#0f172a",
    subheading: "#64748b",
    muted: "#94a3b8",
  },
};

const TIME_PERIODS = [
  "Today", 
  "This Week", 
  "This Month", 
  "This Quarter", 
  "This Year"
];

const RidesOverviewChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [filterType, setFilterType] = useState("All");

  const getRidesData = useMemo(() => {
    const baseData = [
      { 
        day: "Mon", 
        riders: 10, 
        drivers: 25, 
        pending: 15, 
        totalRides: 50,
        averageRating: 4.5,
        peakHours: [7, 18],
        topRoutes: ["Downtown", "Airport"]
      },
      { 
        day: "Tue", 
        riders: 38, 
        drivers: 20, 
        pending: 22, 
        totalRides: 80,
        averageRating: 4.3,
        peakHours: [8, 17],
        topRoutes: ["University", "Business District"]
      },
      { 
        day: "Wed", 
        riders: 45, 
        drivers: 25, 
        pending: 20, 
        totalRides: 90,
        averageRating: 4.2,
        peakHours: [6, 19],
        topRoutes: ["Shopping Mall", "Suburbs"]
      },
      { 
        day: "Thu", 
        riders: 30, 
        drivers: 30, 
        pending: 10, 
        totalRides: 70,
        averageRating: 4.6,
        peakHours: [7, 20],
        topRoutes: ["Tech Park", "Residential Area"]
      },
      { 
        day: "Fri", 
        riders: 35, 
        drivers: 20, 
        pending: 5, 
        totalRides: 60,
        averageRating: 4.7,
        peakHours: [5, 22],
        topRoutes: ["Night Out Areas", "Entertainment District"]
      },
      { 
        day: "Sat", 
        riders: 45, 
        drivers: 35, 
        pending: 20, 
        totalRides: 100,
        averageRating: 4.4,
        peakHours: [10, 23],
        topRoutes: ["Tourist Spots", "Shopping Centers"]
      },
      { 
        day: "Sun", 
        riders: 48, 
        drivers: 32, 
        pending: 20, 
        totalRides: 100,
        averageRating: 4.1,
        peakHours: [11, 20],
        topRoutes: ["Leisure Areas", "Restaurants"]
      },
    ];

    // Intelligent Filtering Logic
    return baseData.map(item => {
      switch(filterType) {
        case "High Demand":
          return { 
            ...item, 
            riders: Math.min(item.riders * 1.5, 100), 
            drivers: Math.min(item.drivers * 1.2, 50),
            totalRides: Math.min(item.totalRides * 1.3, 130)
          };
        case "Low Demand":
          return { 
            ...item, 
            riders: Math.max(item.riders * 0.7, 30), 
            drivers: Math.max(item.drivers * 0.8, 15),
            totalRides: Math.max(item.totalRides * 0.7, 70)
          };
        default:
          return item;
      }
    });
  }, [filterType]);

  // Performance Insights Calculation
  const performanceInsights = useMemo(() => {
    const totalRides = getRidesData.reduce((sum, day) => sum + day.totalRides, 0);
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
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Access the payload data
      return (
        <div className="bg-white shadow-2xl rounded-xl p-4 border border-gray-100 space-y-2">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            <span className="font-semibold">{data.day}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              <span>Riders: {data.riders}</span>
            </div>
            <div className="flex items-center">
              <Car className="w-5 h-5 mr-2 text-green-500" />
              <span>Drivers: {data.drivers}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-red-500" />
              <span>Pending: {data.pending}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>Avg Rating: {data.averageRating}</span>
            </div>
            <div className="flex items-center col-span-2">
              <MapPin className="w-5 h-5 mr-2 text-purple-500" />
              <span>Top Routes: {data.topRoutes.join(", ")}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-2xl rounded-3xl overflow-hidden border-none">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
        <div>
          <CardTitle className="text-2xl font-extrabold text-slate-800 flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-blue-500 stroke-[2.5]" /> 
            Rides Overview
          </CardTitle>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Mobility Insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              className="appearance-none w-full pl-4 pr-10 py-2 text-sm 
              bg-white border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-400/30 
              cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-md flex items-center"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Rides</option>
              <option value="High Demand">High Demand</option>
              <option value="Low Demand">Low Demand</option>
            </select>
            <Filter 
              className="absolute right-3 top-1/2 -translate-y-1/2 
              text-slate-400 pointer-events-none" 
            />
          </div>

          {/* Period Dropdown */}
          <div className="relative">
            <select
              className="appearance-none w-full pl-4 pr-10 py-2 text-sm 
              bg-white border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-400/30 
              cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-md"
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
              text-slate-400 pointer-events-none" 
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 bg-white">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={getRidesData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#f3f4f6" 
              />
              <XAxis 
                dataKey="day" 
                
                axisLine={false} 
                tickLine={false}
                className="text-sm"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                className="text-sm"
              />
              <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} cursor={{ fill: 'transparent' }} />
              {/* Stacked Bars */}
              <Bar
                dataKey="riders"
                fill={CHART_COLORS.primary.main}
                stackId="stack"
                radius={[10, 10, 10, 10]}
                barSize={10}
              />
              <Bar
                dataKey="drivers"
                fill={CHART_COLORS.secondary.main}
                stackId="stack"
                radius={[10, 10, 10, 10]}
                barSize={10}
              />
              <Bar
                dataKey="pending"
                fill={CHART_COLORS.tertiary.main}
                stackId="stack"
                radius={[10, 10, 10, 10]}
                barSize={10}
              />
              {/* Trend Line */}
              <Line
                type="monotone"
                dataKey="totalRides"
                stroke={CHART_COLORS.accent.success}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{ 
                  paddingTop: '10px',
                  fontSize: '0.875rem',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Performance Summary */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4 bg-blue-50 rounded-2xl p-4 shadow-md">
          <div className="text-center border-r border-blue-100 pr-4">
            <p className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Total Rides
            </p>
            <p className="text-xl font-bold text-slate-800">
              {performanceInsights.totalRides}
            </p>
          </div>
          <div className="text-center border-r border-blue-100 pr-4">
            <p className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Peak Performance
            </p>
            <p className="text-xl font-bold text-slate-800">
              {performanceInsights.peakDay}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-1 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Top Route
            </p>
            <p className="text-xl font-bold text-slate-800">
              {performanceInsights.topRoute}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RidesOverviewChart;