"use client";

import React, { useState } from "react";
// component
import OverviewDashboard from "@/components/dashboard/Overview/OverviewDashboard";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";
import Revenue from "@/components/dashboard/Revenue/Revenue";
import VehicleManagement from "@/components/dashboard/vehicles/vehicles";
import PaymentDashboard from "@/components/dashboard/payment/payment";
import RidesManagement from "@/components/dashboard/Overview/rides/page";
import AnalyticsPageRide from "@/components/dashboard/Overview/rides/RideAnalitics";
import TransactionsPage from "@/components/dashboard/transactions/page";
import SettingsPage from "@/components/dashboard/settings/UserSettings";
import TablePage from "@/components/dashboard/users/all-drivers/driver-request";
import FlaggedIssuesPage from "@/components/dashboard/transactions/flagged-isues";
import UserManagement from "@/components/dashboard/users/all-users-page/all-users";
import RideHistory from "@/components/dashboard/Overview/rides/ride-history/page";
import SuspensionHistoryPage from "@/components/dashboard/users/suspension/suspension";
import AuditLogs from "@/components/dashboard/users/audit-logs/audit-logs";
import RefundRequestsPage from "@/components/dashboard/users/refund-requests/page";
import DashboardTest from "@/components/dashboard/example/dashboard";
import { useNotifications } from "@/components/dashboard/sidebar/notification/hooks";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
};

type TimeRange = "day" | "week" | "month" | "quarter";

// Main Dashboard
const Dashboard: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  useNotifications();

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
        return <RidesManagement />;
      case "/revenue":
        return <Revenue />;
        case "/dash":
        return <DashboardTest />;
      case "/transactions":
        return <TransactionsPage />;
      case "/issues":
        return <FlaggedIssuesPage />;
      case "/performance":
        return <VehicleManagement />;
      case "/vehicles":
        return <RefundRequestsPage />;
      case "/cost":
        return <PaymentDashboard />;
      case "/settings":
        return <SettingsPage />;
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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onCollapseChange={handleSidebarCollapse}
        notificationUpdateInterval={15000} // 15 seconds
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
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
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
