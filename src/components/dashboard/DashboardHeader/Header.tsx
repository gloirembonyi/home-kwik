import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  RefreshCcw,
  Bell,
  ChevronDown,
  Car,
  Settings,
  LogOut,
  User,
  Activity,
  Map,
  TrendingUp,
  Shield,
  Sun,
  Moon,
  Link,
} from "lucide-react";
import { Badge } from "@/components/ui/base/badge";
import { Button } from "@/components/ui/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/base/dropdown-menu";
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { Input } from "@/components/ui/Input";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import type { Route } from "next";
// import SearchBar from "@/components/search-bar/page";

// Types
type TimeRange = "day" | "week" | "month" | "quarter";
type NotificationType = "success" | "info" | "warning";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: React.ComponentType<any>;
  type: NotificationType;
}

interface BrandingSectionProps {
  timeRange: TimeRange;
}

interface SearchBarProps {
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
}

interface NotificationItemProps {
  notification: Notification;
}

interface DashboardHeaderProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refreshData: () => void;
}

// Constants
const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  day: "24h",
  week: "7d",
  month: "30d",
  quarter: "3m",
};
//get user by decomposing the token
const token = localStorage.getItem("token");
const payload = token ? jwt.decode(token, { complete: true }) : null;
const userId =
  typeof payload?.payload === "object"
    ? (payload.payload as CustomJwtPayload).userId
    : "";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "New Ride Request",
    message: "customer requested DwonTown routs to Kibagabaga",
    time: "2 min ago",
    icon: Car,
    type: "success",
  },
  {
    id: 2,
    title: "Revenue Milestone Achieved",
    message: "Daily target exceeded by 25%",
    time: "15 min ago",
    icon: TrendingUp,
    type: "info",
  },
  {
    id: 3,
    title: "System Update Available",
    message: "New security features available",
    time: "1 hour ago",
    icon: Shield,
    type: "warning",
  },
];

const SearchBar: React.FC<SearchBarProps> = ({
  searchFocused,
  setSearchFocused,
}) => (
  <div className="relative flex items-center">
    <Search className="absolute left-3 text-muted-foreground w-4 h-4 pointer-events-none" />
    <input
      type="text"
      placeholder="Search..."
      onFocus={() => setSearchFocused(true)}
      onBlur={() => setSearchFocused(false)}
      className={cn(
        "h-9 w-[200px] sm:w-[300px] pl-9 pr-3 text-sm rounded-md",
        "bg-background border border-input",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "transition-all duration-200"
      )}
    />
  </div>
);

const BrandingSection: React.FC<BrandingSectionProps> = ({ timeRange }) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-3 relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary rounded-lg blur opacity-25 group-hover:opacity-45 transition duration-200" />
      {/* <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm"
      >
        K
      </motion.div> */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-foreground">Hello John!</h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  </div>
);

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const { icon: Icon } = notification;
  const typeStyles = {
    success: "text-green-500 bg-green-500/10 dark:bg-green-500/20",
    info: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
    warning: "text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20",
  };

  return (
    <motion.div
      whileHover={{ x: 2 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        "hover:bg-accent/50 transition-colors cursor-pointer"
      )}
    >
      <div className={cn("p-2 rounded-lg", typeStyles[notification.type])}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.time}
        </p>
      </div>
    </motion.div>
  );
};

// Custom Hooks
const useScrollEffect = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
};

// Main Component
const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeRange,
  setTimeRange,
  refreshData,
}) => {
  const router = useRouter();
  const scrolled = useScrollEffect();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [notifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing.");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/mobile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        setUser(response.data.data.user);
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };

    fetchUser();

    // Cleanup function (optional)
    return () => {
      // Clean up if necessary
    };
  }, [token]); //

  console.log(user);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Add handleNavigation function
  const handleNavigation = (path: Route) => {
    router.push(path);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full h-16",
        "border-b border-border",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container h-full flex items-center justify-between px-4">
        <BrandingSection timeRange={timeRange} />

        <div className="flex items-center gap-3">
          <SearchBar
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
          />

          {/* Notification Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative h-9 w-9 rounded-lg",
                  "bg-background hover:bg-accent/50",
                  "border border-border",
                  "transition-colors duration-200"
                )}
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span
                  className={cn(
                    "absolute -top-1 -right-1",
                    "h-4 w-4 rounded-full",
                    "bg-destructive text-[10px] font-medium text-destructive-foreground",
                    "flex items-center justify-center",
                    "animate-pulse ring-2 ring-background"
                  )}
                >
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-[380px] p-2",
                "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "border border-border"
              )}
            >
              <div className="flex items-center justify-between px-2 py-2 mb-2">
                <h3 className="text-sm font-medium text-foreground">
                  Notifications
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20"
                >
                  3 new
                </Badge>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle Button */}
          <div className="relative">
            <ThemeToggle />
          </div>

          {/* Profile Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-10 flex items-center gap-2 px-3",
                  "bg-background/50 hover:bg-accent/50",
                  "border border-border/50",
                  "rounded-lg transition-colors duration-200"
                )}
              >
                <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name.split(" ")[0].split("")[0] +
                      user?.name.split(" ")[1].split("")[0]}
                  </span>
                </div>

                <div className="hidden md:flex flex-col items-start">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user?.currentRole?.name}
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-56 p-2",
                "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "border border-border"
              )}
            >
              <div className="flex items-center gap-2 p-2 mb-2">
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg",
                    "bg-primary/10 border border-primary/20",
                    "flex items-center justify-center"
                  )}
                >
                  <span className="text-sm font-medium text-primary">
                    {user?.name.split(" ")[0].split("")[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "admin@kwikride.com"}
                  </p>
                </div>
              </div>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md hover:bg-accent/50">
                <User size={16} className="text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md hover:bg-accent/50">
                <Activity size={16} className="text-muted-foreground" />
                <span>Activity</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md hover:bg-accent/50">
                <Map size={16} className="text-muted-foreground" />
                <span>Routes</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md hover:bg-accent/50">
                <TrendingUp size={16} className="text-muted-foreground" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md hover:bg-accent/50">
                <Shield size={16} className="text-muted-foreground" />
                <span>Security</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                className="flex items-center gap-2 rounded-md hover:bg-accent/50"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings size={16} className="text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 rounded-md text-destructive hover:bg-destructive/10">
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
