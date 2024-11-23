"use client";
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar/page";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";

// Define the TimeRange type
type TimeRange = "day" | "week" | "month" | "quarter";
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  const refreshData = () => {
    // Refresh data from API
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <DashboardHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        refreshData={refreshData}
      />
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
