"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Navigation,
  TrendingUp,
  Star,
  BarChart2,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/components/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "./notification/hooks";
import { NotificationService } from "./notification/notifications-service";

interface NotificationCount {
  count: number;
  severity: "low" | "medium" | "high";
  lastUpdated: number;
  isRead?: boolean;
}

type NotificationsState = Record<string, NotificationCount>;

interface MenuItem {
  icon?: React.ReactElement;
  label: string;
  path: string;
  notifications?: NotificationCount;
  comingSoon?: boolean;
  subItems?: MenuItem[];
}

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  notificationUpdateInterval?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  onCollapseChange,
  notificationUpdateInterval = 30000,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const notificationService = useMemo(
    () => NotificationService.getInstance(),
    []
  );
  const notifications = useNotifications();

  const handleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  }, [isCollapsed, onCollapseChange]);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }, []);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        icon: <LayoutDashboard />,
        label: "Dashboard",
        path: "/dashboard",
        notifications: notifications["dashboard"],
      },
      {
        icon: <Users />,
        label: "Users",
        path: "/dashboard/users",
        notifications: notifications["users"],
        subItems: [
          { label: "All Users", path: "/dashboard/users" },
          {
            label: "Requests",
            path: "/dashboard/users/requests",
            notifications: notifications["requests"],
          },
          { label: "Suspension", path: "/dashboard/users/suspension" },
          {
            label: "Logs",
            path: "/dashboard/users/logs",
            notifications: notifications["logs"],
          },
          {
            label: "Refunds",
            path: "/dashboard/users/refunds",
            notifications: notifications["refunds"],
          },
        ],
      },
      {
        icon: <Navigation />,
        label: "Rides",
        path: "/dashboard/rides",
        subItems: [
          { label: "Ride Analytics", path: "/dashboard/rides/analytics" },
          { label: "Ride History", path: "/dashboard/rides/history" },
          { label: "Fleet", path: "/dashboard/rides/fleet" },
        ],
      },
      { 
        icon: <TrendingUp />, 
        label: "Revenue", 
        path: "/dashboard/revenue"
      },
      {
        icon: <Star />,
        label: "Transactions",
        path: "/dashboard/transactions",
        subItems: [
          { label: "All Transactions", path: "/dashboard/transactions" },
          { label: "Topup History", path: "/dashboard/transactions/topup-history" },
          { label: "Issues", path: "/dashboard/transactions/issues" },
        ],
      },
      { 
        icon: <BarChart2 />, 
        label: "Performance", 
        path: "/dashboard/performance" 
      },
      { 
        icon: <DollarSign />, 
        label: "Payment", 
        path: "/dashboard/payment" 
      },
      { 
        icon: <Settings />, 
        label: "Settings", 
        path: "/dashboard/settings" 
      },
    ],
    [notifications]
  );

  const NotificationBadge = React.memo(
    ({ notification }: { notification?: NotificationCount }) => {
      if (!notification?.count || notification.isRead) return null;

      const displayCount = notification.count > 99 ? "99+" : notification.count;

      const severityColorMap = {
        high: {
          base: "bg-destructive text-destructive-foreground",
          ring: "ring-destructive/20",
        },
        medium: {
          base: "bg-warning text-warning-foreground",
          ring: "ring-warning/20",
        },
        low: {
          base: "bg-info text-info-foreground",
          ring: "ring-info/20",
        },
      };

      const { base, ring } = severityColorMap[notification.severity];

      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 1],
            opacity: 1,
          }}
          className={cn(
            "ml-auto text-xs font-bold rounded-full px-2 py-0.5",
            "ring-2 ring-opacity-50 shadow-lg",
            base,
            ring,
            notification.count > 5 ? "animate-pulse" : ""
          )}
        >
          {displayCount}
        </motion.span>
      );
    }
  );

  const MenuItemIcon = React.memo(
    ({ icon, isActive }: { icon: React.ReactElement; isActive: boolean }) => (
      <motion.span
        whileHover={{ scale: 1.1 }}
        className={cn(
          "transition-colors duration-200",
          isActive
            ? "text-accent-foreground"
            : "text-muted-foreground group-hover:text-accent-foreground"
        )}
      >
        {icon}
      </motion.span>
    )
  );

  // MenuItem component
  const MenuItem = React.memo(
    ({
      item,
      isCollapsed,
      isActive,
      onClick,
      isDropdownOpen,
    }: {
      item: MenuItem;
      isCollapsed: boolean;
      isActive: boolean;
      onClick: () => void;
      isDropdownOpen?: boolean;
    }) => (
      <motion.div
        whileHover={{ x: 4 }}
        onClick={onClick}
        className={cn(
          "group relative flex items-center rounded-lg cursor-pointer",
          "transition-all duration-200 ease-in-out",
          isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-3",
          isActive
            ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-accent"
            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
          item.comingSoon && "opacity-50 cursor-not-allowed"
        )}
      >
        {item.icon && <MenuItemIcon icon={item.icon} isActive={isActive} />}

        {!isCollapsed && (
          <span
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              isActive
                ? "text-accent-foreground"
                : "text-muted-foreground group-hover:text-accent-foreground"
            )}
          >
            {item.label}
          </span>
        )}

        {!isCollapsed && item.subItems && (
          <motion.span
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            className="ml-auto text-muted-foreground group-hover:text-accent-foreground"
          >
            <ChevronDown size={16} />
          </motion.span>
        )}

        {item.notifications && (
          <NotificationBadge notification={item.notifications} />
        )}
      </motion.div>
    )
  );

  const handleNavigation = useCallback(
    (path: string) => {
      console.log("Navigating to:", path); // Debug log
      onNavigate(path);

      // Check if there's a notification for this path
      const notification = notifications[path];
      if (notification && !notification.isRead) {
        console.log("Found unread notification for:", path); // Debug log
        notificationService.markAsRead(path);
      }
    },
    [notifications, onNavigate, notificationService]
  );

  const renderMenuItem = useCallback(
    (item: MenuItem) => {
      const isActive = currentPath === item.path;
      const isDropdownOpen = openDropdown === item.label;

      const handleItemClick = () => {
        if (item.subItems) {
          toggleDropdown(item.label);
        } else {
          handleNavigation(item.path);
        }
      };

      const handleSubItemClick = (subItem: MenuItem) => {
        handleNavigation(subItem.path);
      };

      return (
        <div key={item.path || item.label} className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleItemClick}
            className={cn(
              "group relative flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
              isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-3",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-accent"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
              item.comingSoon && "opacity-50 cursor-not-allowed"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {item.icon && (
              <span className="text-muted-foreground group-hover:text-accent-foreground">
                {item.icon}
              </span>
            )}

            {!isCollapsed && (
              <span className="text-sm font-medium text-muted-foreground group-hover:text-accent-foreground">
                {item.label}
              </span>
            )}

            {!isCollapsed && item.subItems && (
              <span className="ml-auto text-muted-foreground group-hover:text-accent-foreground">
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            )}

            {!isCollapsed &&
              item.notifications &&
              !item.notifications.isRead && (
                <NotificationBadge notification={item.notifications} />
              )}
          </motion.div>

          <AnimatePresence>
            {isDropdownOpen && item.subItems && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8 space-y-1 overflow-hidden"
              >
                {item.subItems.map((subItem) => (
                  <div
                    key={subItem.path}
                    onClick={() => handleSubItemClick(subItem)}
                    className={cn(
                      "flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out px-4 py-2 gap-3 text-sm",
                      currentPath === subItem.path
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    {subItem.label}
                    {subItem.notifications && !subItem.notifications.isRead && (
                      <NotificationBadge notification={subItem.notifications} />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    },
    [currentPath, isCollapsed, openDropdown, toggleDropdown, handleNavigation]
  );

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r border-border",
        "shadow-lg z-40 overflow-hidden",
        "backdrop-blur-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div
          className={cn(
            "px-6 py-[0.85rem] border-b border-border flex items-center transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-primary text-primary-foreground w-10 h-9 rounded-full flex items-center justify-center font-bold text-xl shadow-md"
            >
              K
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-bold text-lg text-foreground tracking-wider"
                >
                  KWIK RIDE
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-1">{menuItems.map(renderMenuItem)}</div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border space-y-2">
          <div
            onClick={() => onNavigate("/help")}
            className={cn(
              "group flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
              isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-3",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <HelpCircle
              size={20}
              className="text-muted-foreground group-hover:text-accent-foreground"
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-sm"
                >
                  Help
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div
            onClick={onLogout || (() => signOut())}
            className={cn(
              "group flex items-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
              isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-3",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <LogOut
              size={20}
              className="text-muted-foreground group-hover:text-destructive"
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleCollapse}
            className={cn(
              "w-full flex items-center transition-all duration-300 ease-in-out rounded-lg",
              isCollapsed ? "justify-center p-2" : "justify-between px-4 py-2",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <span className="text-sm">Collapse</span>
                <ChevronLeft size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
