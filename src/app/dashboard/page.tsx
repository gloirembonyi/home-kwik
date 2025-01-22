"use client";

import FleetPage from "@/components/dashboard/map/fleet";
import dynamic from "next/dynamic";
import React, { useState } from "react";

type TimeRange = "day" | "week" | "month" | "quarter";

// Dynamically import components with ssr: false
const OverviewDashboard = dynamic(
  () =>
    import("@/components/dashboard/Overview/home-dashboard/OverviewDashboard"),
  { ssr: false }
);
const Sidebar = dynamic(
  () => import("@/components/dashboard/sidebar/sidebar"),
  {
    ssr: false,
  }
);
const DashboardHeader = dynamic(
  () => import("@/components/dashboard/DashboardHeader/Header"),
  { ssr: false }
);
const Revenue = dynamic(() => import("@/components/dashboard/Revenue/page"), {
  ssr: false,
});
const VehicleManagement = dynamic(
  () => import("@/components/dashboard/vehicles/vehicles"),
  { ssr: false }
);
const PaymentDashboard = dynamic(
  () => import("@/components/dashboard/payment/payment"),
  { ssr: false }
);
const RidesManagement = dynamic(
  () => import("@/components/dashboard/Overview/rides/page"),
  { ssr: false }
);
const AnalyticsPageRide = dynamic(
  () => import("@/components/dashboard/Overview/rides/RideAnalitics"),
  { ssr: false }
);
const TransactionsPage = dynamic(
  () => import("@/components/dashboard/transactions/page"),
  { ssr: false }
);
const TopupHistory = dynamic(
  () => import("@/components/dashboard/transactions/Topup-History/topup"),
  { ssr: false }
);
const TablePage = dynamic(
  () => import("@/components/dashboard/users/all-drivers/driver-request"),
  { ssr: false }
);
const FlaggedIssuesPage = dynamic(
  () => import("@/components/dashboard/transactions/flagged-isues"),
  { ssr: false }
);
const UserManagement = dynamic(
  () => import("@/components/dashboard/users/all-users-page/all-users"),
  { ssr: false }
);
const RideHistory = dynamic(
  () => import("@/components/dashboard/Overview/rides/ride-history/page"),
  { ssr: false }
);
const SuspensionHistoryPage = dynamic(
  () => import("@/components/dashboard/users/suspension/suspension"),
  { ssr: false }
);
const AuditLogs = dynamic(
  () => import("@/components/dashboard/users/audit-logs/audit-logs"),
  { ssr: false }
);
const RefundRequestsPage = dynamic(
  () => import("@/components/dashboard/users/refund-requests/page"),
  { ssr: false }
);
const SettingSystem = dynamic(
  () => import("@/components/dashboard/settings/settings-system"),
  { ssr: false }
);

// Main Dashboard Component
const Dashboard = () => {
  const [currentPath, setCurrentPath] = React.useState("/dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const refreshData = () => {
    console.log("Refreshing data...");
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const renderContent = () => {
    switch (currentPath) {
      case "/dashboard":
        return (
          <OverviewDashboard
            currentPath={currentPath}
            onNavigate={handleNavigation}
          />
        );
      case "/users":
        return <UserManagement />;
      case "/requests":
        return <TablePage />;
      case "/rides":
        return <RidesManagement />;
      case "/rides/analytics":
        return <AnalyticsPageRide />;
      case "/rides/history":
        return <RideHistory />;
      case "/suspension":
        return <SuspensionHistoryPage />;
      case "/logs":
        return <AuditLogs />;
      case "/refunds":
        return <RefundRequestsPage />;
      case "/rides/fleet":
        return <FleetPage />;
      case "/revenue":
        return <Revenue />;
      case "/dash":
        return <SettingSystem />;
      case "/transactions":
        return <TransactionsPage />;
      case "/topup-history":
        return <TopupHistory />;
      case "/issues":
        return <FlaggedIssuesPage />;
      case "/performance":
        return <VehicleManagement />;
      case "/vehicles":
        return <RefundRequestsPage />;
      case "/cost":
        return <PaymentDashboard />;
      case "/settings":
        return <SettingSystem />;
      default:
        return (
          <OverviewDashboard
            currentPath={currentPath}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onCollapseChange={handleSidebarCollapse}
        notificationUpdateInterval={15000}
      />

      <div
        className={`
          flex-1 
          overflow-y-auto 
          transition-all 
          duration-300 
          ease-in-out 
          ${isSidebarCollapsed ? "ml-20" : "ml-64"}
        `}
      >
        <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
          <DashboardHeader
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            refreshData={refreshData}
          />
        </div>
        <main className="px-4 py-6 space-y-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
