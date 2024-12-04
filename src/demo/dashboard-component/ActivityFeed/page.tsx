import React, { useState, useEffect } from "react";
import {
  Car,
  UserCheck,
  AlertTriangle,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  Bell,
  Activity as ActivityIcon,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  BarChart,
  Shield,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/base/card";
import { ScrollArea } from "@/components/ui/base/scroll-area";
import { Badge } from "@/components/ui/base/badge";
import { Button } from "@/components/ui/base/button";

type ActivityType = "ride" | "driver" | "system" | "high" | "best";
type ActivityStatus = "pending" | "completed" | "upcoming" | "active" | "best";

interface Activity {
  type: ActivityType;
  message: string;
  time: string;
  details: ActivityDetails;
  status: ActivityStatus;
  priority?: "high" | "medium" | "low";
}

interface ActivityDetails {
  location?: string;
  distance?: string;
  price?: string;
  driver?: string;
  rating?: number;
  earnings?: string;
  date?: string;
  duration?: string;
  impact?: string;
  multiplier?: string;
  area?: string;
  customerType?: string;
  vehicleType?: string;
  estimatedValue?: string;
}

const activities: Activity[] = [
  {
    type: "best",
    message: "VIP Customer Request - Premium Service",
    time: "Just now",
    priority: "high",
    details: {
      location: "Grand Plaza Hotel, Executive Wing",
      distance: "8.5 km",
      price: "$75.00",
      customerType: "Platinum Member",
      vehicleType: "Luxury Sedan",
      estimatedValue: "$150.00",
    },
    status: "best",
  },
  {
    type: "high",
    message: "Premium Airport Transfer Scheduled",
    time: "1m ago",
    priority: "high",
    details: {
      location: "International Airport - Terminal 1",
      distance: "12.3 km",
      price: "$45.50",
      vehicleType: "Business Class",
      duration: "35 mins",
    },
    status: "upcoming",
  },
  {
    type: "system",
    message: "System maintenance scheduled",
    time: "10m ago",
    details: {
      date: "Tomorrow, 3 AM",
      duration: "2 hours",
      impact: "Low",
    },
    status: "upcoming",
  },
  {
    type: "ride",
    message: "Surge pricing activated in North Area",
    time: "15m ago",
    details: {
      multiplier: "1.8x",
      area: "North Business District",
      duration: "1 hour",
    },
    status: "active",
  },
];

const statusStyles: Record<
  ActivityStatus,
  { bg: string; text: string; icon: JSX.Element }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: <Clock className="h-3 w-3" />,
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <UserCheck className="h-3 w-3" />,
  },
  upcoming: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  active: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: <ActivityIcon className="h-3 w-3" />,
  },
  best: {
    bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
    text: "text-amber-800",
    icon: <Shield className="h-3 w-3" />,
  },
};

const iconStyles: Record<ActivityType, { bg: string; text: string }> = {
  ride: { bg: "bg-blue-100", text: "text-blue-600" },
  driver: { bg: "bg-green-100", text: "text-green-600" },
  system: { bg: "bg-amber-100", text: "text-amber-600" },
  high: { bg: "bg-purple-100", text: "text-purple-600" },
  best: {
    bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
    text: "text-amber-800",
  },
};

const ActivityFeed: React.FC = () => {
  const [data, setData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | "all">(
    "all"
  );

  useEffect(() => {
    setTimeout(() => {
      setData(activities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: ActivityStatus, priority?: string) => {
    const style = statusStyles[status];
    return (
      <div className="flex items-center gap-2">
        {priority && (
          <Badge
            className={`${
              priority === "high"
                ? "bg-red-50 text-red-700"
                : priority === "medium"
                ? "bg-orange-50 text-orange-700"
                : "bg-blue-50 text-blue-700"
            } px-2 py-0.5 text-xs rounded-full`}
          >
            {priority}
          </Badge>
        )}
        <Badge
          className={`${style.bg} ${
            style.text
          } text-xs font-medium px-3 py-1 rounded-full
            flex items-center gap-1 transition-all duration-300 hover:shadow-md
            ${status === "best" ? "border border-amber-200" : ""}`}
        >
          {style.icon}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    );
  };

  const getActivityIcon = (type: ActivityType) => {
    const icons: Record<ActivityType, JSX.Element> = {
      ride: <Car className="h-5 w-5" />,
      driver: <UserCheck className="h-5 w-5" />,
      system: <AlertTriangle className="h-5 w-5" />,
      high: <DollarSign className="h-5 w-5" />,
      best: <Shield className="h-5 w-5" />,
    };

    const style = iconStyles[type];
    return (
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${
          style.bg
        } 
        ${
          style.text
        } transform transition-all duration-300 hover:scale-110 hover:shadow-lg
        ${type === "best" ? "border border-amber-200 shadow-amber-100" : ""}`}
      >
        {icons[type]}
      </div>
    );
  };

  const getActivityDetails = (details: ActivityDetails, type: ActivityType) => {
    return (
      <div
        className={`mt-3 rounded-xl p-3 space-y-2
        transform transition-all duration-300 hover:shadow-md
        ${
          type === "best"
            ? "bg-gradient-to-r from-amber-50/50 to-yellow-50/50 border border-amber-100"
            : type === "high"
            ? "bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100"
            : "bg-gray-50 dark:bg-gray-800"
        }`}
      >
        {Object.entries(details).map(([key, value], index) => (
          <div key={index} className="flex items-center text-sm gap-3">
            {key === "location" && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {value}
                </span>
              </div>
            )}
            {key === "rating" && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(value as number)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500" />
                  ))}
                </div>
                <span className="font-medium">{value}</span>
              </div>
            )}
            {key === "price" && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">{value}</span>
              </div>
            )}
            {key !== "location" && key !== "rating" && key !== "price" && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span
                  className={`font-medium ${
                    key === "customerType" || key === "vehicleType"
                      ? "text-purple-600"
                      : ""
                  }`}
                >
                  {value?.toString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getLoadingSkeleton = () => (
    <div className="flex items-start space-x-4 p-4">
      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full w-1/2 animate-pulse" />
        <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse" />
      </div>
    </div>
  );

  const Stats = () => (
    <div className="grid grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 border-b">
      {[
        {
          icon: <Users className="h-5 w-5" />,
          label: "Active Drivers",
          value: "234",
          trend: "+12%",
        },
        {
          icon: <Car className="h-5 w-5" />,
          label: "Ongoing Rides",
          value: "45",
          trend: "+5%",
        },
        {
          icon: <DollarSign className="h-5 w-5" />,
          label: "Today's Revenue",
          value: "$12,456",
          trend: "+18%",
        },
        {
          icon: <Star className="h-5 w-5" />,
          label: "Avg Rating",
          value: "4.8",
          trend: "+0.2",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
        >
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              {stat.icon}
            </div>
            <Badge className="bg-green-50 text-green-700 flex items-center gap-1">
              {stat.trend}
              <ArrowUpRight className="h-3 w-3" />
            </Badge>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-7xl shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600">
        <div className="flex items-center justify-between text-white">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bell className="h-6 w-6" />
              </div>
              Activity Feed
            </CardTitle>
            <CardDescription className="text-blue-100 mt-2">
              Real-time activity monitoring and insights
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {/* <Badge className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
              Premium
            </Badge> */}
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Stats />

      <div className="p-2 bg-gray-50 border-b flex gap-2">
        {["all", "best", "high", "ride", "driver", "system"].map((type) => (
          <Button
            key={type}
            onClick={() => setSelectedFilter(type as ActivityType | "all")}
            className={`rounded-lg px-3 py-1 text-sm ${
              selectedFilter === type
                ? "bg-blue-100 text-blue-700"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="divide-y">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <React.Fragment key={i}>
                    {getLoadingSkeleton()}
                  </React.Fragment>
                ))
              : data
                  .filter(
                    (activity) =>
                      selectedFilter === "all" ||
                      activity.type === selectedFilter
                  )
                  .map((activity, i) => (
                    <div
                      key={i}
                      className={`flex items-start space-x-4 p-4 transition-all duration-300 group
    ${
      activity.type === "best"
        ? "bg-gradient-to-r from-amber-50/30 to-yellow-50/30 hover:from-amber-50/50 hover:to-yellow-50/50"
        : activity.type === "high"
        ? "bg-gradient-to-r from-purple-50/30 to-pink-50/30 hover:from-purple-50/50 hover:to-pink-50/50"
        : "hover:bg-gray-50 dark:hover:bg-gray-800"
    }`}
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-semibold ${
                              activity.type === "best"
                                ? "text-amber-800"
                                : activity.type === "high"
                                ? "text-purple-800"
                                : ""
                            }`}
                          >
                            {activity.message}
                          </p>
                          {getStatusBadge(activity.status, activity.priority)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                        {getActivityDetails(activity.details, activity.type)}
                      </div>
                      <button
                        className={`p-2 rounded-full transition-all duration-300 
      opacity-0 group-hover:opacity-100 
      ${
        activity.type === "best"
          ? "hover:bg-amber-100"
          : activity.type === "high"
          ? "hover:bg-purple-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
                      >
                        <ChevronRight
                          className={`h-5 w-5 ${
                            activity.type === "best"
                              ? "text-amber-600"
                              : activity.type === "high"
                              ? "text-purple-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <ActivityIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">6 New Activities</span>
              <span className="text-xs text-gray-500">2 rides requested</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">25% increase</span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white 
        hover:from-blue-600 hover:to-blue-700 
        transition-all duration-300 rounded-lg px-4 py-2 
        flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            View All Activities
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default ActivityFeed;
