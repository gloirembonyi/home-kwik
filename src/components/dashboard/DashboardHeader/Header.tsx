import React from "react";
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
import SearchBar from "@/components/search-bar/page";

// Types
type TimeRange = "day" | "week" | "month" | "quarter";

type NotificationType = "success" | "info" | "warning";

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

// Subcomponents
const BrandingSection: React.FC<BrandingSectionProps> = ({ timeRange }) => (
  <div className="flex items-center space-x-6">
    <div className="flex items-center space-x-3">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200" />
        <h1 className="relative text-2xl font-bold">
          Hello John!
        </h1>
      </div>
      <div className="hidden lg:flex items-center space-x-2">
        {/* <Badge
          variant="secondary"
          className="text-xs font-medium animate-fade-in bg-primary/10 text-primary"
        >
          {TIME_RANGE_LABELS[timeRange]}
        </Badge>
        <Badge
          variant="outline"
          className="text-xs font-medium animate-pulse border-green-500 text-green-500"
        >
          Live
        </Badge> */}
      </div>
    </div>
  </div>
);



const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => (
  <div className="mb-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer group">
    <div className="flex items-start space-x-4">
      <div
        className={`h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center
        ${notification.type === "success" ? "from-green-500 to-green-600" : ""}
        ${notification.type === "info" ? "from-blue-500 to-blue-600" : ""}
        ${
          notification.type === "warning" ? "from-amber-500 to-amber-600" : ""
        }`}
      >
        <notification.icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold group-hover:text-primary transition-colors">
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
      </div>
    </div>
  </div>
);

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
  const scrolled = useScrollEffect();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [searchFocused, setSearchFocused] = React.useState(false);
  const [notifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
            : "bg-white dark:bg-gray-900"
        }`}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <BrandingSection timeRange={timeRange} />

            <div className="flex items-center space-x-6">
              <SearchBar
                searchFocused={searchFocused}
                setSearchFocused={setSearchFocused}
              />

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 bg-gray-50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 transition-all duration-200 rounded-xl border-2 border-gray-200 hover:border-primary/30">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    <SelectValue placeholder="Select time range" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-gray-200">
                  {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map(
                    (range) => (
                      <SelectItem key={range} value={range}>
                        Last {TIME_RANGE_LABELS[range]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>


              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshData}
                  className="relative group rounded-xl border-2 border-gray-200 hover:border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200" />
                  <RefreshCcw className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="relative group rounded-xl border-2 border-gray-200 hover:border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200" />
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative group rounded-xl border-2 border-gray-200 hover:border-primary/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200" />
                      <Bell className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-96 p-4 rounded-xl border-2"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Notifications
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {notifications.length} new
                      </Badge>
                    </div>
                    <ScrollArea className="h-[400px] pr-4">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="relative group px-4 rounded-xl border-2 border-gray-200 hover:border-primary/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-200" />
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            JD
                          </span>
                        </div>
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-500">Admin</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-4 rounded-xl border-2"
                  >
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-600/10">
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">john@kwikride.com</p>
                      <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                        Admin Account
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {[
                        { icon: User, label: "Profile" },
                        { icon: Activity, label: "Activity" },
                        { icon: Map, label: "Ride History" },
                        { icon: Settings, label: "Settings" },
                      ].map(({ icon: Icon, label }) => (
                        <DropdownMenuItem
                          key={label}
                          className="rounded-lg cursor-pointer hover:bg-primary/10"
                        >
                          <Icon className="w-4 h-4 mr-2" /> {label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
