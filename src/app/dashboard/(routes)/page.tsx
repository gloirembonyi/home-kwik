"use client";

import { useRouter, usePathname } from "next/navigation";
import OverviewDashboard from "@/components/dashboard/Overview/home-dashboard/OverviewDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <OverviewDashboard currentPath={pathname} onNavigate={handleNavigate} />
  );
}
