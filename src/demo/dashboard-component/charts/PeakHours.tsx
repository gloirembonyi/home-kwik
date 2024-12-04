import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Clock, Users, Clock3, TrendingUp, Calendar, ArrowUpRight, 
  ArrowDownRight, Activity, AlertTriangle, CheckCircle 
} from 'lucide-react';

// Define interfaces for type safety
interface HourData {
  hour: number;
  rides: number;
  avgWaitTime: number;
  utilization: number;
  status: 'high' | 'medium' | 'low';
  revenue: number;
  previousRides: number;
}

interface Stats {
  totalRides: number;
  avgWaitTime: number;
  avgUtilization: number;
  totalRevenue: number;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: number;
  detail?: string;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: HourData }>;
  label?: string;
}

interface StatusIndicatorProps {
  utilization: number;
}

// Utility functions for data generation and processing
const generateMockData = (baseDate = new Date()): HourData[] => {
  const isWeekend = baseDate.getDay() === 0 || baseDate.getDay() === 6;
  
  return Array.from({ length: 24 }, (_, i) => {
    const isRushHour = (i >= 7 && i <= 9) || (i >= 16 && i <= 18);
    const isDaytime = i >= 6 && i <= 22;
    
    const baseRides = isDaytime ? (isWeekend ? 400 : 300) : 100;
    const rushHourMultiplier = isRushHour ? (isWeekend ? 2.5 : 3) : 1;
    const randomVariation = Math.random() * 0.4 + 0.8;
    
    const rides = Math.floor(baseRides * rushHourMultiplier * randomVariation);
    const avgWaitTime = Math.floor((isRushHour ? 8 : 4) * randomVariation);
    const utilization = Math.floor((isRushHour ? 85 : 65) * randomVariation);
    
    return {
      hour: i,
      rides,
      avgWaitTime,
      utilization,
      status: utilization > 80 ? 'high' : utilization > 60 ? 'medium' : 'low',
      revenue: rides * (15 + Math.random() * 10), // Average fare between $15-25
      previousRides: Math.floor(rides * (0.9 + Math.random() * 0.2)), // Previous week data
    };
  });
};

// Enhanced Stat Card with Animation
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, detail, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 
                 transition-all duration-300 ${isHovered ? 'transform -translate-y-1 shadow-md' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isHovered ? 'bg-blue-100' : 'bg-blue-50'} transition-colors duration-300`}>
            <Icon className={`w-5 h-5 ${isHovered ? 'text-blue-600' : 'text-blue-500'} transition-colors duration-300`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
            {detail && <p className="text-xs text-gray-400 mt-1">{detail}</p>}
          </div>
        </div>
        <Badge 
          className={`
            ${trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
            transition-all duration-300 ${isHovered ? 'scale-110' : ''}
          `}
        >
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4 inline mr-1" /> : <ArrowDownRight className="w-4 h-4 inline mr-1" />}
          {Math.abs(trend)}%
        </Badge>
      </div>
    </div>
  );
};

// Enhanced Tooltip Component
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const ridesDiff = data.rides - data.previousRides;
    const ridesDiffPercentage = ((ridesDiff / data.previousRides) * 100).toFixed(1);
    
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-gray-900">
            {`${String(label).padStart(2, '0')}:00 - ${String(Number(label) + 1).padStart(2, '0')}:00`}
          </p>
          <Badge 
            className={
              data.status === 'high' ? 'bg-red-50 text-red-700' :
              data.status === 'medium' ? 'bg-yellow-50 text-yellow-700' :
              'bg-green-50 text-green-700'
            }
          >
            {data.status === 'high' ? 'Peak' : data.status === 'medium' ? 'Busy' : 'Normal'}
          </Badge>
        </div>
        
        <div className="space-y-2 border-t pt-2">
          <div className="flex items-center justify-between text-blue-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">{data.rides.toLocaleString()} rides</span>
            </div>
            <span className={`text-sm ${ridesDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ridesDiff >= 0 ? '+' : ''}{ridesDiffPercentage}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center">
              <Clock3 className="w-4 h-4 mr-2" />
              <span>{data.avgWaitTime} min wait</span>
            </div>
            <span className="text-sm">{data.utilization}% util.</span>
          </div>
          
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              <span>${data.revenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Status Indicator Component
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ utilization }) => {
  const status = utilization > 80 ? 'critical' : utilization > 60 ? 'warning' : 'normal';
  
  return (
    <div className="flex items-center space-x-2">
      {status === 'critical' ? (
        <AlertTriangle className="w-5 h-5 text-red-500" />
      ) : status === 'warning' ? (
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
      <span className={`text-sm font-medium
        ${status === 'critical' ? 'text-red-700' : 
          status === 'warning' ? 'text-yellow-700' : 
          'text-green-700'}`}>
        {status === 'critical' ? 'High Load' : 
         status === 'warning' ? 'Moderate Load' : 
         'Normal Operation'}
      </span>
    </div>
  );
};

const PeakHours: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [data, setData] = useState<HourData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
    }, 1000);
  }, [timeFilter]);

  const stats = useMemo<Stats | null>(() => {
    if (!data.length) return null;
    
    const totalRides = data.reduce((sum, hour) => sum + hour.rides, 0);
    const avgWaitTime = Math.round(data.reduce((sum, hour) => sum + hour.avgWaitTime, 0) / 24);
    const avgUtilization = Math.round(data.reduce((sum, hour) => sum + hour.utilization, 0) / 24);
    const totalRevenue = data.reduce((sum, hour) => sum + hour.revenue, 0);
    
    return { totalRides, avgWaitTime, avgUtilization, totalRevenue };
  }, [data]);

  if (isLoading || !stats) {
    return (
      <Card className="shadow-lg animate-pulse">
        <CardHeader className="pb-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Peak Hours Analytics
            </CardTitle>
            <CardDescription className="mt-1 text-gray-600">
              Real-time performance metrics and trends
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <StatusIndicator utilization={stats.avgUtilization} />
            <Badge variant="secondary" className="px-3 py-1 flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Live</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Users} 
            label="Total Rides" 
            value={stats.totalRides.toLocaleString()} 
            trend={12}
            detail="vs. last week"
          />
          <StatCard 
            icon={Clock} 
            label="Avg Wait Time" 
            value={`${stats.avgWaitTime} min`} 
            trend={-5}
            detail="improving"
          />
          <StatCard 
            icon={TrendingUp} 
            label="Utilization" 
            value={`${stats.avgUtilization}%`} 
            trend={8}
            detail="fleet efficiency"
          />
          <StatCard 
            icon={Activity} 
            label="Revenue" 
            value={`$${Math.floor(stats.totalRevenue).toLocaleString()}`} 
            trend={15}
            detail="daily earnings"
          />
        </div>

        <div className="h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.9}/>
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tickFormatter={(hour) => `${String(hour).padStart(2, '0')}:00`}
                fontSize={12}
                tickMargin={8}
                stroke="#6b7280"
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => `${value.toLocaleString()}`}
                stroke="#6b7280"
                yAxisId="left"
              />
              <YAxis
                orientation="right"
                yAxisId="right"
                tickFormatter={(value) => `${value}%`}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="rides"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                yAxisId="left"
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={false}
                yAxisId="right"
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeakHours;