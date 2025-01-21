import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/base/card";
import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Star,
  MapPin,
  Truck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import { Button } from "@/components/ui/base/button";
import { Badge } from "@/components/ui/base/badge";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/base/dialog";
import { TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

// interface

type users = {
  id: number;
  name: string;
  avatar: string;
  startRoute: string;
  endRoute: string;
  rating: number;
};

type FlexibleUser = {
  [key: string]: string | number;
};

type TooltipPayload = {
  rating: string;
  count: number;
  percentage: number;
};

type ValueType = string | number;
type NameType = string;

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  payload?: Array<{
    payload: TooltipPayload;
  }>;
}

//mock data with more details
const mockData = {
  stats: [
    {
      label: "Average Rating",
      value: "4.5",
      icon: <Star className="text-blue-600" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Driver Utilization",
      value: "78%",
      icon: <Truck className="text-green-600" />,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      label: "Active Vehicles",
      value: "245",
      icon: <MapPin className="text-yellow-600" />,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
  ],
  ratingDistribution: [
    { rating: "1.5", count: 40, percentage: 5, color: "#EF4444" },
    { rating: "2", count: 50, percentage: 8, color: "#F97316" },
    { rating: "2.5", count: 100, percentage: 15, color: "#FBBF24" },
    { rating: "3", count: 60, percentage: 30, color: "#10B981" },
    { rating: "3.5", count: 85, percentage: 42, color: "#3B82F6" },
    { rating: "4", count: 95, percentage: 60, color: "#3B82F6" },
    { rating: "4.5", count: 60, percentage: 72, color: "#3B82F6" },
    { rating: "5", count: 130, percentage: 90, color: "#3B82F6" },
  ],
  topUsers: [
    {
      id: 1,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      startRoute: "New York",
      endRoute: "Los Angeles",
      rating: 4.9,
      feedback: "Excellent",
      trips: 120,
      joinDate: "2022-03-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/api/placeholder/40/40",
      startRoute: "San Francisco",
      endRoute: "Texas",
      rating: 4.7,
      feedback: "Great",
      trips: 95,
      joinDate: "2022-07-22",
    },
    {
      id: 3,
      name: "Mike Brown",
      avatar: "/api/placeholder/40/40",
      startRoute: "Florida",
      endRoute: "Georgia",
      rating: 4.6,
      feedback: "Good",
      trips: 80,
      joinDate: "2022-11-05",
    },
  ],
};

const VehicleManagement = () => {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "rating",
    direction: "desc",
  });
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Sorting and filtering logic for top users
  const sortedUsers = useMemo(() => {
    let users = [...mockData.topUsers];

    // Filter by search term
    if (searchTerm) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.startRoute.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.endRoute.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating) {
      users = users.filter((user) => Math.floor(user.rating) === filterRating);
    }

    // Sorting
    users.sort((a, b) => {
      const aKey = a[sortConfig.key as keyof typeof a];
      const bKey = b[sortConfig.key as keyof typeof b];
      if (aKey < bKey) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aKey > bKey) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return users;
  }, [searchTerm, sortConfig, filterRating]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const renderRatingDistributionTooltip = (
    props: TooltipProps<ValueType, NameType>
  ) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload as TooltipPayload;
      return (
        <div className="bg-card p-4 shadow-lg rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-foreground">{data.rating}</span>
            <Badge variant="secondary">{data.count} Ratings</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 bg-background">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockData.stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex items-center p-4 space-x-4 hover:shadow-md transition-shadow"
          >
            <div
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-full",
                stat.bgColor,
                "dark:bg-opacity-10"
              )}
            >
              {stat.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </h3>
              <p className={cn("text-xl font-bold", stat.textColor)}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Rating Distribution Chart*/}
      <Card className="bg-card hover:shadow-lg transition-shadow border border-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">
                Rating Distribution
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 font-medium">
                Comprehensive breakdown of driver ratings
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {filterRating && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setFilterRating(null)}
                >
                  {filterRating}★
                  <X className="ml-2 w-4 h-4" />
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={mockData.ratingDistribution}>
              <XAxis
                dataKey="rating"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--foreground)" }}
              />
              <Tooltip
                content={renderRatingDistributionTooltip}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="count"
                barSize={40}
                radius={[5, 5, 0, 0]}
                onMouseDown={(data) => {
                  const ratingValue = parseInt(
                    data.activePayload[0].payload.rating
                  );
                  setFilterRating(ratingValue);
                }}
              >
                {mockData.ratingDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
          <div className="text-center text-sm text-muted-foreground mt-2">
            Click on a bar to filter drivers by rating
          </div>
        </CardContent>
      </Card>

      {/* Top Rated Drivers Section */}
      <Card className="shadow-lg border border-border hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-card/50 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">
                Top Rated Drivers
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2 font-medium">
                Driver who consistently deliver outstanding service
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative flex items-center">
                <input
                  type="search"
                  placeholder="Search rides, riders, or drivers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2.5 bg-background border border-input rounded-md
                    text-sm placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-colors duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto group">
                    <Filter className="mr-2 w-4 h-4 group-hover:rotate-6 transition" />
                    Filter
                    {filterRating && (
                      <Badge variant="secondary" className="ml-2">
                        {filterRating}★
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <DropdownMenuItem
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={cn(
                        "cursor-pointer",
                        filterRating === rating && "bg-accent"
                      )}
                    >
                      {rating}★ and above
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterRating(null)}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  {[
                    { key: "name", label: "Driver" },
                    { key: "startRoute", label: "Route" },
                    { key: "rating", label: "Rating" },
                    { label: "Feedback" },
                    { label: "Actions" },
                  ].map((header) => (
                    <th
                      key={header.label}
                      className={cn(
                        "py-4 px-6 text-muted-foreground font-bold",
                        header.key &&
                          "cursor-pointer hover:bg-accent/50 transition group"
                      )}
                      onClick={() => header.key && handleSort(header.key)}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.key && (
                          <ArrowUpDown className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "hover:bg-accent/5 transition duration-200 group cursor-pointer",
                      selectedDriver === user.id && "bg-accent/10"
                    )}
                    onClick={() => setSelectedDriver(user.id)}
                  >
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={`${user.name}'s Avatar`}
                          className="w-12 h-12 rounded-full border-2 border-border"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">
                          {user.name}
                        </span>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.startRoute}</span>
                        <ChevronDown className="w-4 h-4" />
                        <span className="font-medium">{user.endRoute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="text-sm font-bold text-foreground">
                          {user.rating}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          user.feedback === "Excellent"
                            ? "default"
                            : user.feedback === "Great"
                            ? "secondary"
                            : "outline"
                        }
                        className="px-3 py-1"
                      >
                        {user.feedback}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-accent"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>
                              Driver Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DialogTrigger asChild>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem>Contact</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Driver Profile: {user.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={user.avatar}
                                alt={`${user.name}'s profile`}
                                className="w-20 h-20 rounded-full"
                              />
                              <div>
                                <p className="text-xl font-bold text-foreground">
                                  {user.name}
                                </p>
                                <p className="text-muted-foreground">
                                  Total Trips: {user.trips}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Route Expertise
                                </p>
                                <p className="text-foreground">
                                  {user.startRoute} → {user.endRoute}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Rating
                                </p>
                                <div className="flex items-center">
                                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                  <span className="font-bold text-foreground">
                                    {user.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedUsers.length === 0 && (
              <div className="text-center py-12 bg-muted/50">
                <div className="text-foreground font-semibold text-lg">
                  No drivers match your search or filter criteria
                </div>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleManagement;
