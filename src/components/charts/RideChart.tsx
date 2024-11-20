import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RideStat {
  date: string;
  rides: number;
  revenue: number;
}

const mockData: RideStat[] = [
  { date: '2024-01-01', rides: 200, revenue: 1500 },
  { date: '2024-01-02', rides: 300, revenue: 2200 },
  { date: '2024-01-03', rides: 450, revenue: 3500 },
  { date: '2024-01-04', rides: 550, revenue: 4200 },
  { date: '2024-01-05', rides: 700, revenue: 5000 },
  { date: '2024-01-06', rides: 800, revenue: 6000 },
  { date: '2024-01-07', rides: 750, revenue: 5800 },
];

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const calculateGrowth = (data: RideStat[]) => {
  if (data.length < 2) return { rides: 0, revenue: 0 };
  const first = data[0];
  const last = data[data.length - 1];
  return {
    rides: ((last.rides - first.rides) / first.rides) * 100,
    revenue: ((last.revenue - first.revenue) / first.revenue) * 100
  };
};

export const RideChart: React.FC = () => {
  const growth = calculateGrowth(mockData);
  const latestData = mockData[mockData.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
          <p className="text-slate-200 font-medium mb-2">{formatDate(label)}</p>
          <p className="text-blue-400">
            Rides: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-emerald-400">
            Revenue: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Ride Statistics</CardTitle>
        <CardDescription>Daily overview of rides and revenue</CardDescription>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-100 p-4 rounded-lg">
            <p className="text-sm text-slate-500">Total Rides</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{latestData.rides.toLocaleString()}</p>
              <div className={`flex items-center ${growth.rides >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growth.rides >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                <span className="text-sm font-medium">{Math.abs(growth.rides).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-100 p-4 rounded-lg">
            <p className="text-sm text-slate-500">Revenue</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{formatCurrency(latestData.revenue)}</p>
              <div className={`flex items-center ${growth.revenue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {growth.revenue >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                <span className="text-sm font-medium">{Math.abs(growth.revenue).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
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
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              
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
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
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
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RideChart;