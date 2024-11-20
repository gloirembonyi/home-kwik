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
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { AlertCircle, Loader2, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/base/alert';

// Types remain the same
interface RatingData {
  rating: string;
  frequency: number;
  percentageChange: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RatingData & { total: number };
  }>;
  label?: string;
}

interface ChartProps {
  data?: RatingData[];
  loading?: boolean;
  error?: string | null;
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
}

interface DashboardGridProps {
  metrics?: {
    driverStats?: RatingData[];
  };
  loading?: boolean;
}

// Enhanced sample data with better colors
const sampleData: RatingData[] = [
  { rating: "5 Stars", frequency: 1200, percentageChange: 5.2, color: "#0ea5e9" },
  { rating: "4 Stars", frequency: 800, percentageChange: -2.1, color: "#38bdf8" },
  { rating: "3 Stars", frequency: 400, percentageChange: 1.5, color: "#7dd3fc" },
  { rating: "2 Stars", frequency: 200, percentageChange: -0.8, color: "#bae6fd" },
  { rating: "1 Star", frequency: 100, percentageChange: -3.2, color: "#e0f2fe" }
];

const StatCard: React.FC<{ label: string; value: string; change: number }> = ({ label, value, change }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {change >= 0 ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change > 0 ? '+' : ''}{change}% from last period
    </p>
  </div>
);

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { frequency, percentageChange, total } = payload[0].payload;
    const percentage = total > 0 ? ((frequency / total) * 100).toFixed(1) : '0';

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 transition-all duration-200 transform scale-100 hover:scale-102">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <p className="font-semibold text-gray-900">{label}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-600">Count: <span className="font-semibold">{frequency.toLocaleString()}</span></p>
          <p className="text-gray-600">Percentage: <span className="font-semibold">{percentage}%</span></p>
          {percentageChange != null && (
            <div className={`flex items-center gap-1 font-medium ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(percentageChange)}% from last period</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const DriverPerformanceChart: React.FC<ChartProps> = ({ 
  data = sampleData, 
  loading = false, 
  error = null 
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const totalRatings = data.reduce((sum, item) => sum + (item.frequency || 0), 0);
  const averageRating = data.reduce((sum, item, index) => 
    sum + (item.frequency * (5 - index)), 0) / totalRatings;
  
  const enhancedData = data.map(item => ({
    ...item,
    total: totalRatings,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Ratings" 
          value={totalRatings.toLocaleString()} 
          change={2.5} 
        />
        <StatCard 
          label="Average Rating" 
          value={averageRating.toFixed(1)} 
          change={0.3} 
        />
        <StatCard 
          label="5-Star Ratings" 
          value={`${((data[0].frequency / totalRatings) * 100).toFixed(1)}%`} 
          change={data[0].percentageChange} 
        />
      </div>
      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={enhancedData}
            layout="vertical"
            margin={{ top: 20, right: 60, left: 60, bottom: 20 }}
            onMouseMove={(state: any) => {
              if (state?.activeTooltipIndex !== undefined) {
                setHoveredBar(state.activeTooltipIndex);
              }
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
              className="text-gray-600"
            />
            <YAxis
              type="category"
              dataKey="rating"
              width={80}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-gray-600"
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Legend />
            <Bar
              dataKey="frequency"
              name="Number of Ratings"
              barSize={24}
              label={{
                position: 'right',
                formatter: (value: number) => value.toLocaleString(),
                fontSize: 11,
                fill: '#6b7280',
              }}
              animationDuration={600}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={hoveredBar === null || hoveredBar === index ? 1 : 0.5}
                  className="transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  description, 
  children, 
  loading = false 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const DashboardGrid: React.FC<DashboardGridProps> = ({ metrics, loading = false }) => {
  return (
    <div className="max-w-7xl">
      <ChartCard      
        title="Driver Ratings Distribution"
        description="Overview of driver performance ratings and trends"
      >
        <DriverPerformanceChart 
          data={metrics?.driverStats} 
          loading={loading}
        />
      </ChartCard>
    </div>
  );
};

export default DashboardGrid;