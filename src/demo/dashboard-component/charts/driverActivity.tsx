import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { 
  Star,
  TrendingUp,
  Award,
  Users,
  CarFront,
  ShieldCheck
} from 'lucide-react';

interface RatingData {
  rating: string;
  frequency: number;
  percentageChange: number;
  color: string;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: number[];
}

const sampleData: RatingData[] = [
  { rating: "5 Stars", frequency: 1200, percentageChange: 5.2, color: "#2563eb" },
  { rating: "4 Stars", frequency: 800, percentageChange: -2.1, color: "#3b82f6" },
  { rating: "3 Stars", frequency: 400, percentageChange: 1.5, color: "#60a5fa" },
  { rating: "2 Stars", frequency: 200, percentageChange: -0.8, color: "#93c5fd" },
  { rating: "1 Star", frequency: 100, percentageChange: -3.2, color: "#bfdbfe" }
];

const MetricCard: React.FC<PerformanceMetric> = ({ label, value, change, icon, trend }) => {
  const trendData = trend.map((value, index) => ({ value, index }));

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                {icon}
              </div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </div>
            </div>
          </div>
          <div className="h-16 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="url(#trend)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RatingChart: React.FC<{ data: RatingData[] }> = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const { rating, frequency, percentageChange } = payload[0].payload;
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <p className="font-semibold text-gray-900">{rating}</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Total Ratings: <span className="font-semibold">{frequency.toLocaleString()}</span>
            </p>
            <div className={`flex items-center gap-1 ${percentageChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 ${percentageChange >= 0 ? '' : 'rotate-180'}`} />
              <span>{Math.abs(percentageChange)}% from last month</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
          onMouseMove={(state: any) => {
            setHoveredBar(state?.activeTooltipIndex ?? null);
          }}
          onMouseLeave={() => setHoveredBar(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            horizontal={true}
            vertical={true}
          />
          <XAxis
            type="number"
            tickFormatter={(value) => value.toLocaleString()}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="rating"
            width={80}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar
            dataKey="frequency"
            barSize={32}
            animationDuration={1000}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={hoveredBar === null || hoveredBar === index ? 1 : 0.4}
                className="transition-all duration-200"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const KwikDriver: React.FC = () => {
  const metrics: PerformanceMetric[] = [
    {
      label: "Average Rating",
      value: "4.8",
      change: 2.4,
      icon: <Star className="w-5 h-5" />,
      trend: [4.5, 4.6, 4.7, 4.6, 4.8, 4.8]
    },
    {
      label: "Total Rides",
      value: "2,847",
      change: 12.5,
      icon: <CarFront className="w-5 h-5" />,
      trend: [2400, 2500, 2600, 2700, 2800, 2847]
    },
    {
      label: "Active Drivers",
      value: "842",
      change: 5.7,
      icon: <Users className="w-5 h-5" />,
      trend: [780, 795, 810, 825, 835, 842]
    },
    {
      label: "Top Performers",
      value: "124",
      change: 8.3,
      icon: <Award className="w-5 h-5" />,
      trend: [100, 105, 110, 115, 120, 124]
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Performance</h1>
          <p className="text-gray-500 mt-1">Real-time insights and analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>
            Analysis of driver ratings over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RatingChart data={sampleData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default KwikDriver;