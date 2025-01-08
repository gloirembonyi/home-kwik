// NotificationBadge.tsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface NotificationBadgeProps {
  notification?: {
    count: number;
    severity: "low" | "medium" | "high";
    isRead?: boolean;
  };
  collapsed?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  notification,
  collapsed = false,
}) => {
  if (!notification?.count || notification.isRead) return null;

  const displayCount = notification.count > 99 ? "99+" : notification.count;

  const severityColorMap = {
    high: {
      base: "bg-red-500 hover:bg-red-600",
      ring: "ring-red-300",
    },
    medium: {
      base: "bg-amber-500 hover:bg-amber-600",
      ring: "ring-amber-300",
    },
    low: {
      base: "bg-blue-500 hover:bg-blue-600",
      ring: "ring-blue-300",
    },
  };

  const { base, ring } = severityColorMap[notification.severity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "ml-auto flex items-center justify-center",
          "min-w-[20px] h-5",
          "rounded-full px-1.5",
          base,
          "ring-2",
          ring,
          "shadow-sm",
          collapsed ? "absolute -top-1 -right-1" : "",
          notification.count > 5 ? "animate-pulse" : ""
        )}
      >
        <span className="text-xs font-semibold text-white">{displayCount}</span>
      </motion.div>
    </AnimatePresence>
  );
};
