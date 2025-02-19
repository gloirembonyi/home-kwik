"use client";

import { StatsSkeleton, TableSkeleton } from "@/components/ui/LoadingState";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-accent/20 rounded animate-pulse" />
        <div className="h-4 w-48 bg-accent/20 rounded animate-pulse" />
      </div>

      <StatsSkeleton />

      <div className="space-y-4">
        <div className="h-8 w-48 bg-accent/20 rounded animate-pulse" />
        <TableSkeleton />
      </div>
    </div>
  );
}
