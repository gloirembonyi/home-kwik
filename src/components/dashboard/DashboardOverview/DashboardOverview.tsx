import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/base/card';
import MetricCard from '@/components/metric/MetricCard'; // Assuming MetricCard is a custom component
import { Skeleton } from '@/components/ui/base/skeleton';
import { Progress } from '@radix-ui/react-progress';
import { TabsContent } from '@radix-ui/react-tabs';
import { RideChart } from '@/components/charts/RideChart';
import DriverPerformanceChart from '@/components/charts/DriverPerformanceChart';
import { Users, DollarSign, Target, TrendingUp } from 'lucide-react';
import UserActivityChart from '@/components/charts/UserActivityChart';

// Define the type for metrics data
type Metrics = {
  activeUsers: number;
  driverEarnings: number;
  completionRate: number;
  growthRate: number;
  userActivities: any;
  rideStats: any;
  driverStats: any;
  popularRoutes: { route: string; count: number }[];
  peakHours: { hour: string; rides: number }[];
  customerSatisfaction: { category: string; score: number }[];
};

interface DashboardOverviewProps {
  loading: boolean;
  metrics: Metrics;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ loading, metrics }) => {
  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Active Users",
            value: metrics.activeUsers,
            icon: Users,
            change: 12,
            color: "text-blue-500",
          },
          {
            title: "Total Revenue",
            value: metrics.driverEarnings,
            icon: DollarSign,
            change: 8,
            color: "text-green-500",
            prefix: "RWF",
          },
          {
            title: "Completion Rate",
            value: metrics.completionRate,
            icon: Target,
            change: 5,
            color: "text-yellow-500",
            suffix: "%",
          },
          {
            title: "Growth Rate",
            value: metrics.growthRate,
            icon: TrendingUp,
            change: 3,
            color: "text-purple-500",
            suffix: "%",
          },
        ].map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={
              loading
                ? "-"
                : `${metric.prefix || ""}${metric.value.toLocaleString()}${metric.suffix || ""}`
            }
            change={metric.change}
            icon={<metric.icon className={`h-4 w-4 ${metric.color}`} />}
            loading={loading}
            details={<UserActivityChart data={metrics.userActivities} />}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ride Trends</CardTitle>
            <CardDescription>Rides and revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <RideChart data={metrics.rideStats} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Ratings Distribution</CardTitle>
            <CardDescription>Rating frequency analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <DriverPerformanceChart data={metrics.driverStats} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Popular Routes</CardTitle>
            <CardDescription>Top performing routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
              ) : (
                metrics.popularRoutes.slice(0, 5).map((route, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{route.route}</span>
                    <span className="text-sm text-muted-foreground">
                      {route.count} rides
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Busiest times of day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={metrics.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rides" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
            <CardDescription>Key satisfaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
              ) : (
                metrics.customerSatisfaction.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stat.category}</span>
                      <span className="font-medium">{stat.score}%</span>
                    </div>
                    <Progress value={stat.score} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default DashboardOverview;
