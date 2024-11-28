"use client"

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Navigation,
  TrendingUp,
  Star,
  BarChart2,
  Truck,
  DollarSign,
  Settings
} from "lucide-react";

// Import your existing components

import OverviewDashboard from "@/components/dashboard/Overview/OverviewDashboard";
import UserManagement from "@/components/dashboard/Overview/users";
import RidesManagement from "@/components/dashboard/Overview/rides/page";
import SettingsPage from "@/components/dashboard/Overview/UserSettings";
import RiderHistory from "@/components/dashboard/analytics/riderhistory";
import UserDashboard from "@/components/dashboard/userdashboard/page";
import PeakHours from "@/components/charts/PeakHours";
import TicketDashboard from "@/components/support/TicketDashboard";
import ProSidebar from "@/components/dashboard/Overview/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";
import RideAnalytics from "@/components/dashboard/Overview/rides/fleet";
import AnalyticsPageRide from "@/components/dashboard/Overview/rides/RideAnalitics";


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

 // Handles navigation to a selected path
 const handleNavigation = (path: string) => {
  setCurrentPath(path);
};

// Handles user logout
const handleLogout = () => {
  console.log("Logging out...");
};

// Refresh logic for data
const refreshData = () => {
  console.log("Refreshing data...");
};

// Handle sidebar collapse state change
const handleSidebarCollapse = (collapsed: boolean) => {
  setIsSidebarCollapsed(collapsed);
};

// Render content based on the current path
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
    case "/rides/fleet":
      return <RideAnalytics />;
    case "/revenue":
      return <RiderHistory />;
    case "/ratings":
      return <RidesManagement />;
    case "/performance":
      return <PeakHours />;
    case "/vehicles":
      return <PeakHours />;
    case "/cost":
      return <TicketDashboard />;
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
        <main className="px-4 py-6 space-y-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;