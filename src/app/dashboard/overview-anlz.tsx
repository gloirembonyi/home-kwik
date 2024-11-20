import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/base/card";
import { Progress } from "@/components/ui/base/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, Star, ChevronUp, ChevronDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradientFrom: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  gradientFrom,
  loading
}) => (
  <Card className={`bg-gradient-to-br from-${gradientFrom} to-white`}>
    <CardContent className="pt-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {loading ? '-' : value}
          </h3>
          {trend && (
            <p className="text-xs flex items-center gap-1">
              {trend.isPositive ? (
                <ChevronUp className="h-4 w-4 text-green-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-red-500" />
              )}
              <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">vs last period</span>
            </p>
          )}
        </div>
        <div className={`p-3 bg-${gradientFrom} rounded-full opacity-90`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface RouteStats {
  route: string;
  count: number;
  trend: number;
}

interface PeakHour {
  hour: number;
  rides: number;
}

interface SatisfactionMetric {
  category: string;
  score: number;
  previousScore?: number;
}

interface OverviewProps {
  metrics: {
    totalRides: number;
    activeDrivers: number;
    avgResponseTime: string;
    satisfactionRate: number;
    popularRoutes: RouteStats[];
    peakHours: PeakHour[];
    customerSatisfaction: SatisfactionMetric[];
  };
  loading?: boolean;
}

const CustomBarTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{`${label}:00 - ${(label + 1) % 24}:00`}</p>
        <p className="text-sm text-blue-600">{`${payload[0].value} rides`}</p>
      </div>
    );
  }
  return null;
};

const Overview: React.FC<OverviewProps> = ({ metrics, loading = false }) => {
  const [animatedTotal, setAnimatedTotal] = React.useState(0);
  
  React.useEffect(() => {
    if (!loading && metrics?.totalRides) {
      const timer = setInterval(() => {
        setAnimatedTotal(prev => {
          const next = prev + Math.ceil(metrics.totalRides / 50);
          return next >= metrics.totalRides ? metrics.totalRides : next;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [loading, metrics?.totalRides]);

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Rides"
          value={loading ? '-' : animatedTotal.toLocaleString()}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          trend={{ value: 12.5, isPositive: true }}
          gradientFrom="blue-50"
          loading={loading}
        />
        <MetricCard
          title="Active Drivers"
          value={loading ? '-' : metrics.activeDrivers}
          icon={<Users className="h-6 w-6 text-green-600" />}
          trend={{ value: 8.2, isPositive: true }}
          gradientFrom="green-50"
          loading={loading}
        />
        <MetricCard
          title="Avg Response Time"
          value={loading ? '-' : metrics.avgResponseTime}
          icon={<Clock className="h-6 w-6 text-purple-600" />}
          trend={{ value: 3.1, isPositive: false }}
          gradientFrom="purple-50"
          loading={loading}
        />
        <MetricCard
          title="Satisfaction Rate"
          value={loading ? '-' : `${metrics.satisfactionRate}%`}
          icon={<Star className="h-6 w-6 text-yellow-600" />}
          trend={{ value: 2.4, isPositive: true }}
          gradientFrom="yellow-50"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Popular Routes */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Popular Routes</span>
              <span className="text-xs font-normal text-gray-500">Last 24h</span>
            </CardTitle>
            <CardDescription>Top performing routes by volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))
                : metrics.popularRoutes.slice(0, 5).map((route, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{route.route}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-blue-600">
                          {route.count.toLocaleString()}
                        </span>
                        <span className={`text-xs ${route.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {route.trend > 0 ? '+' : ''}{route.trend}%
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Peak Hours</span>
              <span className="text-xs font-normal text-gray-500">Today</span>
            </CardTitle>
            <CardDescription>Hourly ride distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 bg-gray-200 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={metrics.peakHours} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="rides"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Customer Satisfaction</span>
              <span className="text-xs font-normal text-gray-500">Last 7d</span>
            </CardTitle>
            <CardDescription>Key satisfaction indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading
                ? Array(4).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                      <div className="h-2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                : metrics.customerSatisfaction.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          {metric.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-900">
                            {metric.score}%
                          </span>
                          {metric.previousScore && (
                            <span className={`text-xs ${
                              metric.score >= metric.previousScore 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {metric.score >= metric.previousScore ? '↑' : '↓'}
                              {Math.abs(metric.score - metric.previousScore)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <Progress 
                          value={metric.score}
                          className="h-2"
                          indicatorClassName={
                            metric.score >= 90 ? "bg-green-500" :
                            metric.score >= 70 ? "bg-yellow-500" :
                            "bg-red-500"
                          }
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;