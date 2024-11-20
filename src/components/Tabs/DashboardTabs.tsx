// // src/components/DashboardTabs.tsx
// import React from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/base/tabs";
// import { DashboardOverview } from '..//Overview/DashboardOverview';
// import { RideAnalytics } from './RideAnalytics';
// import { DriverPerformance } from './DriverPerformance';
// import { UserInsights } from './UserInsights';
// import { DashboardMetrics } from '@/types/dashboard';

// interface DashboardTabsProps {
//   activeTab: string;
//   metrics: DashboardMetrics;
//   loading: boolean;
//   onTabChange: (value: string) => void;
// }

// export const DashboardTabs: React.FC<DashboardTabsProps> = ({
//   activeTab,
//   metrics,
//   loading,
//   onTabChange
// }) => (
//   <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="space-y-6">
//     <TabsList className="grid w-full grid-cols-4">
//       <TabsTrigger value="overview">Overview</TabsTrigger>
//       <TabsTrigger value="rides">Ride Analytics</TabsTrigger>
//       <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
//       <TabsTrigger value="users">User Insights</TabsTrigger>
//     </TabsList>

//     <TabsContent value="overview">
//       <DashboardOverview metrics={metrics} loading={loading} />
//     </TabsContent>
//     <TabsContent value="rides">
//       <RideAnalytics metrics={metrics} loading={loading} />
//     </TabsContent>
//     <TabsContent value="drivers">
//       <DriverPerformance metrics={metrics} loading={loading} />
//     </TabsContent>
//     <TabsContent value="users">
//       <UserInsights metrics={metrics} loading={loading} />
//     </TabsContent>
//   </Tabs>
// );