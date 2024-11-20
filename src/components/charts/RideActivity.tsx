import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Clock, Car, TrendingUp, Calendar } from 'lucide-react';

interface RideStat {
  date: string;
  rides: number;
  revenue: number;
  avgDuration: number;
  activeDrivers: number;
  satisfaction: number;
}

// Enhanced mock data
const mockData: RideStat[] = [
  { date: '2024-01-01', rides: 200, revenue: 1500, avgDuration: 18, activeDrivers: 150, satisfaction: 4.7 },
  { date: '2024-01-02', rides: 300, revenue: 2200, avgDuration: 20, activeDrivers: 165, satisfaction: 4.8 },
  { date: '2024-01-03', rides: 450, revenue: 3500, avgDuration: 22, activeDrivers: 180, satisfaction: 4.9 },
  { date: '2024-01-04', rides: 550, revenue: 4200, avgDuration: 19, activeDrivers: 200, satisfaction: 4.8 },
  { date: '2024-01-05', rides: 700, revenue: 5000, avgDuration: 21, activeDrivers: 220, satisfaction: 4.9 },
  { date: '2024-01-06', rides: 800, revenue: 6000, avgDuration: 23, activeDrivers: 240, satisfaction: 4.7 },
  { date: '2024-01-07', rides: 750, revenue: 5800, avgDuration: 20, activeDrivers: 235, satisfaction: 4.8 },
];

const timeRanges = ['24H', '7D', '30D', '90D', 'ALL'] as const;
type TimeRange = typeof timeRanges[number];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateGrowth = (data: RideStat[]) => {
  if (data.length < 2) return { rides: 0, revenue: 0, drivers: 0 };
  const first = data[0];
  const last = data[data.length - 1];
  return {
    rides: ((last.rides - first.rides) / first.rides) * 100,
    revenue: ((last.revenue - first.revenue) / first.revenue) * 100,
    drivers: ((last.activeDrivers - first.activeDrivers) / first.activeDrivers) * 100
  };
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  growth: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, growth, icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {growth >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        <span className="font-semibold">{Math.abs(growth).toFixed(1)}%</span>
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

export const RideAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  const growth = calculateGrowth(mockData);
  const latestData = mockData[mockData.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 backdrop-blur-lg bg-opacity-90">
          <p className="text-slate-200 font-medium mb-3 border-b border-slate-700 pb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-2">
            <p className="text-blue-400 flex justify-between gap-4">
              <span>Rides:</span>
              <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-emerald-400 flex justify-between gap-4">
              <span>Revenue:</span>
              <span className="font-semibold">{formatCurrency(payload[1].value)}</span>
            </p>
            <p className="text-purple-400 flex justify-between gap-4">
              <span>Avg Duration:</span>
              <span className="font-semibold">{payload[2].value} min</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-white shadow-xl border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Kwik Ride Analytics
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Comprehensive overview of your ride-hailing metrics
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Rides"
            value={latestData.rides.toLocaleString()}
            growth={growth.rides}
            icon={<Car className="text-blue-600" size={24} />}
            color="bg-blue-50"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(latestData.revenue)}
            growth={growth.revenue}
            icon={<DollarSign className="text-emerald-600" size={24} />}
            color="bg-emerald-50"
          />
          <StatCard
            title="Active Drivers"
            value={latestData.activeDrivers.toLocaleString()}
            growth={growth.drivers}
            icon={<Users className="text-purple-600" size={24} />}
            color="bg-purple-50"
          />
          <StatCard
            title="Avg Satisfaction"
            value={`${latestData.satisfaction} / 5.0`}
            growth={2.5}
            icon={<TrendingUp className="text-orange-600" size={24} />}
            color="bg-orange-50"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mockData}>
              <defs>
                <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                className="opacity-50"
              />

              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />

              <YAxis 
                yAxisId="left"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `${value}`}
              />

              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
              />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="rides"
                stroke="#3b82f6"
                fill="url(#colorRides)"
                name="Total Rides"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
              />

              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="url(#colorRevenue)"
                name="Revenue"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#059669', strokeWidth: 2 }}
              />

              <Bar
                yAxisId="left"
                dataKey="activeDrivers"
                fill="#818cf8"
                name="Active Drivers"
                radius={[4, 4, 0, 0]}
                opacity={0.6}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-blue-600">Average Ride Duration</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{latestData.avgDuration} min</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-emerald-600" size={20} />
              <span className="text-sm font-medium text-emerald-600">Average Fare</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {formatCurrency(latestData.revenue / latestData.rides)}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-purple-600" size={20} />
              <span className="text-sm font-medium text-purple-600">Peak Hours</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">2PM - 6PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideAnalytics;