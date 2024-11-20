"use client";

// app/dashboard/layout.tsx
import Sidebar from "@/components/layout/Sidebar/page";
import { useState } from "react";
import DashboardHeader from "../DashboardHeader/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // State for sidebar collapse (if needed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - always visible on desktop, toggleable on mobile */}
      <Sidebar 
        collapsed={isSidebarCollapsed}
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main content area */}
      <div className={`flex flex-col flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header - shows on all dashboard pages */}
        <DashboardHeader 
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}