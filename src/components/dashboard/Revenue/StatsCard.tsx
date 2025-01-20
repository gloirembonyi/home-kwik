import React from "react";
import { cn } from "@/components/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, icon, className }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl transition-colors",
        "dark:border dark:border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
};

export default StatsCard;
