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
import { TooltipProps as RechartsTooltipProps } from "recharts";

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

type CustomTooltipProps = {
  payload: { payload: TooltipPayload }[]; 
};

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
  const [selectedDriver, setSelectedDriver] = useState(null);
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

  const renderRatingDistributionTooltip = ({ payload }: CustomTooltipProps) => {
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{data.rating}</span>
            <Badge variant="secondary">{data.count} Ratings</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Percentage: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
  

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockData.stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex items-center p-4 space-x-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 flex items-center  justify-center rounded-full ${stat.bgColor}`}
            >
              {stat.icon}
            </div>
            <div >
              <h3 className="text-sm font-medium text-gray-600">
                {stat.label}
              </h3>
              <p className={`text-xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Rating Distribution Chart*/}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50 hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-extrabold text-blue-900 tracking-tight">Rating Distribution</CardTitle>
              <CardDescription className="text-blue-700 mt-2 font-medium">
                Comprehensive breakdown of driver ratings
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {filterRating && (
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
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
              <XAxis dataKey="rating" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
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
          <div className="text-center text-sm text-gray-500 mt-2">
            Click on a bar to filter drivers by rating
          </div>
        </CardContent>
      </Card>

      {/* Top Rated Drivers Section */}
      <Card className="shadow-2xl border-2 border-blue-50 hover:border-blue-50 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-extrabold text-blue-900 tracking-tight">
                Top Rated Drivers
              </CardTitle>
              <CardDescription className="text-blue-700 mt-2 font-medium">
                Driver who consistently deliver outstanding service
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div className="relative w-full md:w-64 group">
                <Input
                  placeholder="Search drivers by name or route..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full shadow-md focus:ring-2 focus:ring-blue-300 transition-all duration-300 group-hover:shadow-lg"
                  id="driver-search"
                />
                <Search className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 group-hover:text-blue-600 transition" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-auto bg-white shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group"
                  >
                    <Filter className="mr-2 w-4 h-4 group-hover:rotate-6 transition" />
                    Filter
                    {filterRating && (
                      <Badge variant="secondary" className="ml-2">
                        {filterRating}★
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-xl rounded-xl border-2 border-blue-100">
                  <DropdownMenuLabel className="font-bold text-blue-900">
                    Filter by Rating
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <DropdownMenuItem
                      key={rating}
                      onClick={() => setFilterRating(rating)}
                      className={`cursor-pointer hover:bg-blue-50 transition 
                  ${filterRating === rating ? "bg-blue-100 text-blue-900" : ""}
                `}
                    >
                      {rating}★ and above
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterRating(null)}
                    className="hover:bg-red-50 hover:text-red-700 transition"
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
              <thead className="bg-blue-50 sticky top-0 z-10">
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
                      className={`py-4 px-6 text-blue-800 font-bold cursor-pointer 
                  ${header.key ? "hover:bg-blue-100 transition group" : ""}`}
                      onClick={() => header.key && handleSort(header.key)}
                    >
                      <div className="flex items-center">
                        {header.label}
                        {header.key && (
                          <ArrowUpDown className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition text-blue-500" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`
                hover:bg-blue-50 transition duration-200 
                ${selectedDriver === user.id ? "bg-blue-100 shadow-inner" : ""}
                group cursor-pointer
              `}
                    onClick={() => setSelectedDriver(user.id)}
                  >
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          // alt={`${user.name}'s Avatar`}
                          className="w-12 h-12 rounded-full border-2 border-blue-100 shadow-sm"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.startRoute}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{user.endRoute}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="text-sm font-bold text-gray-800">
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
                              className="hover:bg-gray-100"
                            >
                              <MoreHorizontal className="w-5 h-5 text-gray-600" />
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
                                <p className="text-xl font-bold">{user.name}</p>
                                <p className="text-gray-500">
                                  Total Trips: {user.trips}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Route Expertise
                                </p>
                                <p>
                                  {user.startRoute} → {user.endRoute}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Rating</p>
                                <div className="flex items-center">
                                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                  <span className="font-bold">
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
              <div className="text-center py-12 bg-blue-50">
                <div className="text-blue-600 font-semibold text-lg">
                  No drivers match your search or filter criteria
                </div>
                <p className="text-blue-400 mt-2">
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
