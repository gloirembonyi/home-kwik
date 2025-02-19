"use client";

import dynamic from "next/dynamic";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Dynamically import components with ssr: false
const OverviewDashboard = dynamic(
  () =>
    import("@/components/dashboard/Overview/home-dashboard/OverviewDashboard"),
  { ssr: false }
);
const Revenue = dynamic(() => import("@/components/dashboard/Revenue/page"), {
  ssr: false,
});
const VehicleManagement = dynamic(
  () => import("@/components/dashboard/vehicles-performance/vehicles"),
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
  () => import("@/components/dashboard/Overview/rides/page"),
  { ssr: false }
);
const FleetPage = dynamic(() => import("@/components/dashboard/map/fleet"), {
  ssr: false,
});
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
  () => import("@/components/dashboard/transactions/Issues/flagged-issues"),
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

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname() || "/dashboard";
  const currentPath = pathname.split("/dashboard")[1] || "/";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // ProtectedRoute in layout will handle redirect
  }

  const renderContent = () => {
    switch (currentPath) {
      case "/":
        return (
          <OverviewDashboard
            currentPath={currentPath}
            onNavigate={(path) => console.log(path)}
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
            onNavigate={(path) => console.log(path)}
          />
        );
    }
  };

  return renderContent();
}
