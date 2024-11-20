import React, { useState, useMemo } from 'react';
import {
  ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import { Toggle } from '@/components/ui/base/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/base/select';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricData {
  date: string;
  activeUsers: number;
  rides: number;
  driverAcceptance: number;
  matchingEfficiency: number;
  utilizationRate: number;
}

interface VisibleMetrics {
  activeUsers: boolean;
  rides: boolean;
  driverAcceptance: boolean;
  matchingEfficiency: boolean;
  utilizationRate: boolean;
}

interface MetricChanges {
  activeUsers: string;
  rides: string;
  driverAcceptance: string;
  matchingEfficiency: string;
  utilizationRate: string;
}

interface MetricToggleProps {
  metric: keyof VisibleMetrics;
  label: string;
  color: string;
  change?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: keyof MetricData;
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

interface CombinedMetricsChartProps {
  data?: MetricData[];
}

const CombinedMetricsChart: React.FC<CombinedMetricsChartProps> = ({ data }) => {
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    activeUsers: true,
    rides: true,
    driverAcceptance: true,
    matchingEfficiency: true,
    utilizationRate: true
  });

  const [timeRange, setTimeRange] = useState<string>('30');

  // Calculate period-over-period changes
  const metrics = useMemo(() => {
    if (!data || data.length === 0) return {} as MetricChanges;
    
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    const calculateChange = (current: MetricData, previous: MetricData, key: keyof MetricData): string => {
      return previous ? `${((Number(current[key]) - Number(previous[key])) / Number(previous[key]) * 100).toFixed(1)}` : '0';
    };

    return {
      activeUsers: calculateChange(current, previous, 'activeUsers'),
      rides: calculateChange(current, previous, 'rides'),
      driverAcceptance: calculateChange(current, previous, 'driverAcceptance'),
      matchingEfficiency: calculateChange(current, previous, 'matchingEfficiency'),
      utilizationRate: calculateChange(current, previous, 'utilizationRate')
    } as MetricChanges;
  }, [data]);

  const toggleMetric = (metric: keyof VisibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatValue = (value: number, metric: string): string => {
    if (typeof value !== 'number') return '-';
    if (metric.includes('Rate') || metric.includes('Efficiency')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const MetricToggle: React.FC<MetricToggleProps> = ({ metric, label, color, change }) => (
    <Toggle
      pressed={visibleMetrics[metric]}
      onPressedChange={() => toggleMetric(metric)}
      className="flex-1 min-w-[200px] h-20 p-4 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 border rounded-lg"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-medium">{label}</span>
        </div>
        {change && (
          <div className="flex items-center gap-1">
            {parseFloat(change) > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${parseFloat(change) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change}%
            </span>
          </div>
        )}
      </div>
    </Toggle>
  );

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-3 border-b pb-2">{label && formatDate(label)}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            visibleMetrics[entry.dataKey as keyof VisibleMetrics] && (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 min-w-[140px]">
                  {entry.name}
                </span>
                <span className="font-medium">
                  {formatValue(entry.value, entry.dataKey)}
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  // Generate sample data if none provided
  const sampleData = useMemo(() => {
    if (data && data.length > 0) return data;

    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString(),
        activeUsers: Math.floor(10000 + Math.random() * 2000),
        rides: Math.floor(8000 + Math.random() * 1500),
        driverAcceptance: 75 + Math.random() * 10,
        matchingEfficiency: 85 + Math.random() * 8,
        utilizationRate: 70 + Math.random() * 12
      };
    });
  }, [data]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-6">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              All Performance Metrics
            </CardTitle>
            <CardDescription className="mt-2">
              Comprehensive view of key platform metrics and their trends
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <MetricToggle 
            metric="activeUsers"
            label="Active Users"
            color="#3b82f6"
            change={metrics.activeUsers}
          />
          <MetricToggle 
            metric="rides"
            label="Total Rides"
            color="#10b981"
            change={metrics.rides}
          />
          <MetricToggle 
            metric="driverAcceptance"
            label="Driver Acceptance"
            color="#f59e0b"
            change={metrics.driverAcceptance}
          />
          <MetricToggle 
            metric="matchingEfficiency"
            label="Matching Efficiency"
            color="#6366f1"
            change={metrics.matchingEfficiency}
          />
          <MetricToggle 
            metric="utilizationRate"
            label="Utilization Rate"
            color="#ec4899"
            change={metrics.utilizationRate}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                yAxisId="users"
                orientation="left"
                domain={[0, 'auto']}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                label={{ 
                  value: 'Users & Rides',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#6b7280' }
                }}
              />
              <YAxis 
                yAxisId="percentage"
                orientation="right"
                domain={[0, 100]}
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                label={{ 
                  value: 'Rates (%)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: '#6b7280' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Brush 
                dataKey="date" 
                height={30} 
                stroke="#8884d8"
                fill="#f3f4f6"
                tickFormatter={formatDate}
              />
              
              {visibleMetrics.activeUsers && (
                <Area
                  yAxisId="users"
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              )}
              {visibleMetrics.rides && (
                <Bar
                  yAxisId="users"
                  dataKey="rides"
                  name="Total Rides"
                  fill="#10b981"
                  fillOpacity={0.8}
                />
              )}
              {visibleMetrics.driverAcceptance && (
                <Line
                  yAxisId="percentage"
                  type="monotone"
                  dataKey="driverAcceptance"
                  name="Driver Acceptance"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {visibleMetrics.matchingEfficiency && (
                <Line
                  yAxisId="percentage"
                  type="monotone"
                  dataKey="matchingEfficiency"
                  name="Matching Efficiency"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {visibleMetrics.utilizationRate && (
                <Line
                  yAxisId="percentage"
                  type="monotone"
                  dataKey="utilizationRate"
                  name="Utilization Rate"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedMetricsChart;