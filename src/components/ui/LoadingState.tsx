import { Card } from "./base/card";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const MapSkeleton = () => (
  <div className="h-full w-full bg-accent/20 animate-pulse rounded-xl" />
);

export const CardSkeleton = () => (
  <Card className="w-full p-6 space-y-4">
    <div className="h-4 bg-accent/20 rounded animate-pulse w-2/3" />
    <div className="space-y-3">
      <div className="h-8 bg-accent/20 rounded animate-pulse" />
      <div className="h-8 bg-accent/20 rounded animate-pulse w-4/5" />
    </div>
  </Card>
);

export const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="p-6 space-y-4">
        <div className="h-4 bg-accent/20 rounded animate-pulse w-1/2" />
        <div className="h-8 bg-accent/20 rounded animate-pulse w-3/4" />
      </Card>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <Card className="w-full overflow-hidden">
    <div className="border-b border-border p-4 bg-accent/20 animate-pulse h-16" />
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="border-b border-border p-4 space-y-2 animate-pulse"
      >
        <div className="h-4 bg-accent/20 rounded w-full" />
        <div className="h-4 bg-accent/20 rounded w-5/6" />
      </div>
    ))}
  </Card>
);
