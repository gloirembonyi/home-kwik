"use client";

import React, { useState } from "react";
// component
import OverviewDashboard from "@/components/dashboard/Overview/OverviewDashboard";
import UserManagement from "@/components/dashboard/users/users";
import SettingsPage from "@/components/dashboard/setting/UserSettings";
import ProSidebar from "@/components/dashboard/sidebar/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";
import Revenue from "@/components/dashboard/Revenue/Revenue";
import VehicleManagement from "@/components/dashboard/vehicles/vehicles";
import PaymentDashboard from "@/components/dashboard/payment/payment";
import TicketDashboard from "@/demo/dashboard-component/support/TicketDashboard";
import RideAnalytics from "@/demo/dashboard-component/charts/RideActivity";
import RidesManagement from "@/components/dashboard/Overview/rides/page";
import PeakHours from "@/demo/dashboard-component/charts/PeakHours";
import Payments from "@/components/dashboard/payment/payment-v";
import RiderHistory from "@/demo/dashboard-component/analytics/riderhistory";
import DriverHistory from "@/demo/dashboard-component/analytics/driver-history";
import AnalyticsPageRide from "@/components/dashboard/Overview/rides/RideAnalitics";
import TransactionsPage from "@/components/dashboard/transactions/page";


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
        return <OverviewDashboard />;
      case "/users":
        return <UserManagement />;
      case "/rides":
        return <RidesManagement />;
      case "/rides/analytics":
        return <AnalyticsPageRide />;
      case "/rides/history":
        return <DriverHistory />;
      case "/rides/fleet":
        return <RidesManagement />;
      case "/revenue":
        return <Revenue />;
      case "/ratings":
        return <TransactionsPage />;
      case "/performance":
        return <VehicleManagement />;
      case "/vehicles":
        return <VehicleManagement />;
      case "/cost":
        return <PaymentDashboard />;
      case "/settings":
        return <SettingsPage />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <ProSidebar
        currentPath={currentPath}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onCollapseChange={handleSidebarCollapse}
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
