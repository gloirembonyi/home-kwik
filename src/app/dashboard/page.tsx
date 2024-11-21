"use client";

import React, { useState, useEffect } from "react";
import { RecoilRoot } from "recoil";
import Rollbar from "rollbar";
import { hotjar } from "react-hotjar";
import mixpanel from "mixpanel-browser";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Users,
  Car,
  Star,
  ThumbsUp,
  Clock,
  Route,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Zap,
  Download,
  Filter,
  RefreshCcw,
  Calendar,
  DollarSign,
  Target,
  TrendingDown,
  Activity,
  MapPin,
  Shield,
  UserPlus,
  Share2,
  Badge,
  Bell,
  ChevronDown,
  LayoutDashboard,
  MessagesSquare,
  Search,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/base/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/base/tabs";
import { Button } from "@/components/ui/base/button";
import { Alert, AlertDescription } from "@/components/ui/base/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/base/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import { Skeleton } from "@/components/ui/base/skeleton";
import { Progress } from "@/components/ui/base/progress";
import { AnalyticsApiService } from "@/services/analyticsService";
import { AnalyticsService } from "@/services/analytics";
import { RideChart } from "@/components/charts/RideChart";
import UserActivityChart from "@/components/charts/UserActivityChart";
import LiveMap from "@/components/map/LiveMap";
import { Input } from "@/components/ui/Input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import DashboardGrid from "@/components/charts/DriverPerformanceChart";
import CustomerSatisfaction from "@/components/charts/CustomerSatisfaction";
import PeakHours from "@/components/charts/PeakHours";
import PopularRoutes from "@/components/charts/PopulRoutes";
import { DashboardMetrics, PeakHourData } from "@/types/dashboard";
import KwikDriver from "@/components/charts/driverActivity";
import RideAnalytics from "@/components/charts/RideActivity";
import CombinedMetricsChart from "@/components/charts/CombinedChart";
import TaskBoard from "@/components/Task Board/page";
import Sidebar from "@/components/layout/Sidebar/page";
import ActivityFeed from "@/components/dashboard/ActivityFeed/page";
import { RiderHistory, DriverHistory } from "@/components/dashboard/analytics/Ride-Share";
import UserDashboard from "@/components/dashboard/userdashboard/page";
import LiveChat from "@/components/support/LiveChat";
import TicketDashboard from "@/components/support/TicketDashboard";
import KwikRideAdminDashboard from "@/components/support/AI/page";
//Analytics Service

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorInfo: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    AnalyticsService.getInstance().trackError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            {this.state.errorInfo ||
              "An error occurred. Please refresh the page or contact support."}
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  loading?: boolean;
  details?: React.ReactNode;
}> = ({ title, value, change, icon, loading, details }) => {
  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{value}</div>
            <div
              className={`text-xs ${
                change >= 0 ? "text-green-500" : "text-red-500"
              } flex items-center gap-1`}
            >
              {change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(change)}% from previous period
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title} Details</DialogTitle>
          <DialogDescription>{details}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

// Redesigned Chart Components

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeUsers: 0,
    registeredUsers: 0,
    totalRides: 0,
    averageRating: 0,
    rideStats: [],
    driverStats: [],
    userActivities: [],
    revenueData: [],
    completionRate: 0,
    cancellationRate: 0,
    riderToDriverRatio: 0,
    averageRideDistance: 0,
    averageRideDuration: 0,
    driverUtilization: 0,
    driverEarnings: 0,
    growthRate: 0,
    peakHours: [],
    popularRoutes: [],
    userGrowth: [],
    customerSatisfaction: [{ score: 0 }],
  });

  useEffect(() => {
    const analytics = AnalyticsService.getInstance();
    analytics.trackEvent("dashboard_viewed", { timeRange });
    fetchDashboardData();
  }, [timeRange]);

  //fetchDashboardData function in your Dashboard component
  // Update the fetchDashboardData function
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const analyticsService = AnalyticsApiService.getInstance();
      const rawData = await analyticsService.fetchDashboardData(timeRange);

      // Transform the data to match the expected types
      const transformedData: DashboardMetrics = {
        ...rawData,
        peakHours: Array.isArray(rawData.peakHours)
          ? rawData.peakHours.map((ph: PeakHourData) => ({
              hour: typeof ph.hour === "number" ? ph.hour : parseInt(ph.hour),
              rides: ph.rides,
            }))
          : [],
        customerSatisfaction: Array.isArray(rawData.customerSatisfaction)
          ? rawData.customerSatisfaction
          : [{ score: 0 }],
      };

      setMetrics(transformedData);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setError("Unable to load dashboard data. Please try again later.");
      AnalyticsService.getInstance().trackError(error as Error, {
        context: "dashboard_data_fetch",
        timeRange,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the Peak Hours chart component to handle string hours

  // Update the handleExport function
  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const analyticsService = AnalyticsApiService.getInstance();
      const blob = await analyticsService.exportData(format, timeRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-data.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(`Failed to export data as ${format.toUpperCase()}`);
    }
  };

  const refreshData = () => {
    AnalyticsService.getInstance().trackEvent("refresh_dashboard");
    fetchDashboardData();
  };

  type ChartCardProps = {
    title: string;
    description: string;
    loading: boolean;
    chart: JSX.Element;
  };

  // ChartCard component with typed props
  const ChartCard: React.FC<ChartCardProps> = ({
    title,
    description,
    loading,
    chart,
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          chart
        )}
      </CardContent>
    </Card>
  );

  return (
    <RecoilRoot>
      <ErrorBoundary>
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}

            {/* Main Content */}
            <main className="flex-1">
              <div className="px-2 sm:px-4 lg:px-4 py-8 space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "Active Users",
                      value: metrics.activeUsers,
                      icon: Users,
                      change: 12,
                      gradient: "from-blue-500 to-blue-600",
                    },
                    {
                      title: "Total Revenue",
                      value: metrics.driverEarnings,
                      icon: DollarSign,
                      change: 8,
                      gradient: "from-green-500 to-green-600",
                      prefix: "RWF",
                    },
                    {
                      title: "Completion Rate",
                      value: metrics.completionRate,
                      icon: Target,
                      change: 5,
                      gradient: "from-yellow-500 to-yellow-600",
                      suffix: "%",
                    },
                    {
                      title: "Growth Rate",
                      value: metrics.growthRate,
                      icon: TrendingUp,
                      change: 3,
                      gradient: "from-purple-500 to-purple-600",
                      suffix: "%",
                    },
                  ].map((metric, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${metric.gradient} p-4 text-white`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium opacity-80">
                              {metric.title}
                            </p>
                            <h3 className="text-2xl font-bold mt-2">
                              {loading
                                ? "-"
                                : `${
                                    metric.prefix || ""
                                  }${metric.value.toLocaleString()}${
                                    metric.suffix || ""
                                  }`}
                            </h3>
                          </div>
                          <metric.icon className="h-5 w-5 opacity-80" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                          {metric.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span>
                            {Math.abs(metric.change)}% from last period
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Tabs Navigation */}
                <Tabs
                  defaultValue={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1">
                    <TabsTrigger value="overview" className="px-3">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="rides" className="px-3">
                      Ride Analytics
                    </TabsTrigger>
                    <TabsTrigger value="drivers" className="px-3">
                      Driver Performance
                    </TabsTrigger>
                    <TabsTrigger value="users" className="px-3">
                      User Insights
                    </TabsTrigger>
                    <TabsTrigger value="other" className="px-3">
                      freatures
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab Content */}
                  <TabsContent value="overview" className="space-y-6">
                    {/* Key Metrics Grid */}

                    <div>
                      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                              : `${
                                  metric.prefix || ""
                                }${metric.value.toLocaleString()}${
                                  metric.suffix || ""
                                }`
                          }
                          change={metric.change}
                          icon={
                            <metric.icon
                              className={`h-4 w-4 ${metric.color}`}
                            />
                          }
                          loading={loading}
                          details={
                            <UserActivityChart data={metrics.userActivities} />
                          }
                        />
                      ))}
                    </div> */}
                    </div>
                    <div>
                      {/* <KwikRideAdminDashboard /> */}
                      <PeakHours />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <RideChart />

                      <DashboardGrid />
                    </div>
                    <div>
                      <CombinedMetricsChart data={undefined} />
                    </div>
                    {/* <div className="grid gap-4 grid-cols-1">
                      <Card>
                        <TabsContent value="map" className="space-y-6">
                        <CardTitle>live map</CardTitle>
                          <LiveMap />
                        </TabsContent>
                      </Card>
                    </div> */}
                    {/* Additional Metrics */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <PopularRoutes />

                      <CustomerSatisfaction />
                    </div>
                  </TabsContent>

                  <TabsContent value="rides" className="space-y-6">
                    {/* Ride Analytics Content */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <MetricCard
                        title="Total Rides"
                        value={metrics.totalRides.toLocaleString()}
                        change={8}
                        icon={<Car className="h-4 w-4 text-blue-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="Average Distance"
                        value={`${metrics.averageRideDistance.toFixed(1)} km`}
                        change={3}
                        icon={<Route className="h-4 w-4 text-green-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="Average Duration"
                        value={`${metrics.averageRideDuration} mins`}
                        change={5}
                        icon={<Clock className="h-4 w-4 text-yellow-500" />}
                        loading={loading}
                      />
                    </div>
                    <div>
                      <RideAnalytics />
                    </div>

                    {/* Add more ride-specific charts and analysis here */}
                  </TabsContent>

                  {/* Driver Performance Tab Content */}
                  <TabsContent value="drivers" className="space-y-6">
                    {/* Driver Performance Content */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <MetricCard
                        title="Average Rating"
                        value={metrics.averageRating.toFixed(1)}
                        change={2}
                        icon={<Star className="h-4 w-4 text-yellow-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="Driver Utilization"
                        value={`${metrics.driverUtilization}%`}
                        change={4}
                        icon={<Activity className="h-4 w-4 text-blue-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="Active Drivers"
                        value={(
                          metrics.activeUsers / metrics.riderToDriverRatio
                        ).toFixed(0)}
                        change={6}
                        icon={<UserCheck className="h-4 w-4 text-green-500" />}
                        loading={loading}
                      />
                    </div>
                    <div>
                      <KwikDriver />
                    </div>
                  </TabsContent>

                  {/* User Insights Tab Content */}
                  <TabsContent value="users" className="space-y-6">
                    {/* User Insights Content */}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <MetricCard
                        title="Registered Users"
                        value={metrics.registeredUsers.toLocaleString()}
                        change={10}
                        icon={<UserPlus className="h-4 w-4 text-purple-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="User Satisfaction"
                        value={`${
                          metrics.customerSatisfaction[0]?.score || 0
                        }%`}
                        change={7}
                        icon={<ThumbsUp className="h-4 w-4 text-green-500" />}
                        loading={loading}
                      />
                      <MetricCard
                        title="Rider/Driver Ratio"
                        value={metrics.riderToDriverRatio.toFixed(1)}
                        change={2}
                        icon={<Share2 className="h-4 w-4 text-blue-500" />}
                        loading={loading}
                      />
                    </div>
                    <div>
                      <UserDashboard />
                    </div>
                  </TabsContent>
                  {/* features we will need */}
                  <TabsContent value="other" className="space-y-6">
                    {/* Ride Analytics Content */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    
                    </div>
                    <div>
                      <RiderHistory />
                      <DriverHistory />
                      <LiveChat />
                      <TicketDashboard />
                      <TaskBoard />
                      <LiveMap />
                    </div>

                    {/* Add more ride-specific charts and analysis here */}
                  </TabsContent>
                </Tabs>

                {/* Real-time Activity Feed */}
                <Card>
                  <div>
                  
                    <ActivityFeed />
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </RecoilRoot>
  );
};

export default Dashboard;
