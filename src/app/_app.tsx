"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar/page";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";

const App = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const refreshData = () => {
    // refresh data from API
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    setIsLoginPage(pathname === "/login");

    // If not authenticated and not on the login page, redirect to login
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    } else {
      // If authenticated or on login page, set loading to false
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return null; // Show nothing while checking authentication
  }

  // If it's the login page, render only the children
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Render layout with sidebar and header for all other pages
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

export default App;