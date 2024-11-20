// // src/components/DashboardOverview.tsx
// import React from 'react';
// import { MetricCard } from './MetricCard';
// import { RideChart } from './charts/RideChart';
// import { DriverPerformanceChart } from './charts/DriverPerformanceChart';
// import { UserActivityChart } from './charts/UserActivityChart';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/base/card";
// import { Skeleton } from "@/components/ui/base/skeleton";
// import { Users, DollarSign, Target, TrendingUp } from "lucide-react";
// import { DashboardMetrics } from '@/types/dashboard';

// interface DashboardOverviewProps {
//   metrics: DashboardMetrics;
//   loading: boolean;
// }

// export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ metrics, loading }) => (
//   <div className="space-y-6">
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <MetricCard
//         title="Active Users"
//         value={loading ? '-' : metrics.activeUsers.toLocaleString()}
//         change={12}
//         icon={<Users className="h-4 w-4 text-blue-500" />}
//         loading={loading}
//         details={
//           <UserActivityChart data={metrics.userActivities} />
//         }
//       />
//       <MetricCard
//         title="Total Revenue"
//         value={loading ? '-' : `$${metrics.driverEarnings.toLocaleString()}`}
//         change={8}
//         icon={<DollarSign className="h-4 w-4 text-green-500" />}
//         loading={loading}
//       />
//       <MetricCard
//         title="Completion Rate"
//         value={loading ? '-' : `${metrics.completionRate}%`}
//         change={5}
//         icon={<Target className="h-4 w-4 text-yellow-500" />}
//         loading={loading}
//       />
//       <MetricCard
//         title="Growth Rate"
//         value={loading ? '-' : `${metrics.growthRate}%`}
//         change={3}
//         icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
//         loading={loading}
//       />
//     </div>

//     <div className="grid gap-4 md:grid-cols-2">
//       <Card>
//         <CardHeader>
//           <CardTitle>Ride Trends</CardTitle>
//           <CardDescription>Rides and revenue over time</CardDescription>
//         </CardHeader>
//         <CardContent className="h-[400px]">
//           {loading ? (
//             <div className="w-full h-full flex items-center justify-center">
//               <Skeleton className="w-full h-full" />
//             </div>
//           ) : (
//             <RideChart data={metrics.rideStats} />
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Driver Performance</CardTitle>
//           <CardDescription>Performance metrics for top drivers</CardDescription>
//         </CardHeader>
//         <CardContent className="h-[400px]">
//           {loading ? (
//             <div className="w-full h-full flex items-center justify-center">
//               <Skeleton className="w-full h-full" />
//             </div>
//           ) : (
//             <DriverPerformanceChart data={metrics.driverStats} />
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   </div>
// );