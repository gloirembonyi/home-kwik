"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/hooks/useAuth";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader/Header";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/base/button";

type TimeRange = "day" | "week" | "month" | "quarter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const { logout } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const refreshData = () => {
    console.log("Refreshing data...");
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="relative h-screen bg-background">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div className="flex h-screen">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed lg:relative shrink-0 z-50",
              "h-full w-64 border-r border-border",
              "bg-background transition-all duration-300",
              isMobile
                ? isMobileSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
                : "translate-x-0",
              isSidebarCollapsed ? "lg:w-20" : "lg:w-64"
            )}
          >
            <Sidebar
              currentPath={pathname}
              onNavigate={handleNavigation}
              onLogout={handleLogout}
              onCollapseChange={setIsSidebarCollapsed}
            />
          </aside>

          {/* Main Content Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
              {isMobile && (
                <div className="flex lg:hidden items-center p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileSidebar}
                    className="mr-2"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
              )}
              <DashboardHeader
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                refreshData={refreshData}
              />
            </header>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-2 lg:p-6 max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
