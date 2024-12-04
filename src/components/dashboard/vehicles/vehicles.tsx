import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Bell,
  UserCircle,
  Filter,
  Star,
  MapPin,
  MoreVertical,
  AlertCircle,
  XCircle,
  Truck,
  Clock,
  PieChart,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/base/card";
import { Badge } from "@/components/ui/base/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from "recharts";

// Improved data generation with more realistic mock data
const generateMockData = () => {
  const currentDate = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    ratingData: [
      { rating: 0, frequency: 10, color: "#FF6B6B" },
      { rating: 1, frequency: 15, color: "#FFD93D" },
      { rating: 2, frequency: 25, color: "#6BCB77" },
      { rating: 3, frequency: 30, color: "#4D96FF" },
      { rating: 4, frequency: 20, color: "#7E57C2" },
      { rating: 5, frequency: 5, color: "#00BFA6" },
    ],
    topUsers: [
      {
        id: "D001",
        name: "Michael Chen",
        avatar: "/api/placeholder/40/40",
        startRoute: "Downtown",
        endRoute: "Suburbs",
        rating: 4.5,
        feedback: "Very Good",
        rides: 120,
        efficiency: 92,
      },
      {
        id: "D002",
        name: "Sarah Rodriguez",
        avatar: "/api/placeholder/40/40",
        startRoute: "Airport",
        endRoute: "City Center",
        rating: 3.8,
        feedback: "Moderate",
        rides: 85,
        efficiency: 78,
      },
      {
        id: "D003",
        name: "Alex Kim",
        avatar: "/api/placeholder/40/40",
        startRoute: "University",
        endRoute: "Shopping Mall",
        rating: 2.1,
        feedback: "Bad",
        rides: 45,
        efficiency: 55,
      },
    ],
    vehicleStatus: [
      { name: "Active", value: 65, color: "#4CAF50" },
      { name: "Maintenance", value: 20, color: "#FFC107" },
      { name: "Inactive", value: 15, color: "#F44336" },
    ],
    driverPerformance: monthNames
      .slice(0, currentDate.getMonth() + 1)
      .map((month, index) => ({
        month,
        rating: 2.0 + index * 0.2,
        rides: 50 + index * 15,
      })),
  };
};

// Improved type definitions
interface TopUser {
  id: string;
  name: string;
  avatar: string;
  startRoute: string;
  endRoute: string;
  rating: number;
  feedback: "Very Good" | "Moderate" | "Bad";
  rides: number;
  efficiency: number;
}

interface FilterOption {
  label: string;
  value: string;
}

const VehicleManagement: React.FC = () => {
  // state management
  const [filter, setFilter] = useState<string>("Today");
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Memoized mock data
  const mockData = useMemo(() => generateMockData(), []);

  // Filter options
  const filterOptions: FilterOption[] = [
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
  ];

  // Compute aggregate statistics
  const aggregateStats = useMemo(
    () => ({
      averageRating: (() => {
        const ratings = mockData.topUsers.map((user) => user.rating);
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
      })(),
      driverUtilization: (() => {
        const totalDrivers = mockData.topUsers.length;
        const activeDrivers = mockData.topUsers.filter(
          (user) => user.feedback === "Very Good"
        ).length;
        return ((activeDrivers / totalDrivers) * 100).toFixed(0);
      })(),
      activeVehicles:
        mockData.vehicleStatus.find((status) => status.name === "Active")
          ?.value || 0,
    }),
    [mockData]
  );

  // Render feedback badge with improved type safety
  const renderFeedbackBadge = useCallback((feedback: string) => {
    const badgeClasses = {
      "Very Good": "bg-green-100 text-green-800",
      Moderate: "bg-orange-100 text-orange-800",
      Bad: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={badgeClasses[feedback as keyof typeof badgeClasses]}>
        {feedback}
      </Badge>
    );
  }, []);

  // Handler for driver selection
  const handleDriverSelect = useCallback(
    (driverId: string) => {
      setSelectedDriver(driverId === selectedDriver ? null : driverId);
    },
    [selectedDriver]
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-pink-700 flex items-center">
              <Star className="mr-2" /> Average Rating
            </CardTitle>
            <RefreshCw className="text-pink-500 hover:rotate-180 transition-transform cursor-pointer" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-pink-800">
              {aggregateStats.averageRating}
            </p>
            {parseFloat(aggregateStats.averageRating) < 3 && (
              <div className="flex items-center text-sm text-pink-600 mt-2">
                <AlertCircle className="mr-1" /> Needs Improvement
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-orange-700 flex items-center">
              <Users className="mr-2" /> Driver Utilization
            </CardTitle>
            <PieChart className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-800">
              {aggregateStats.driverUtilization}%
            </p>
            {Number(aggregateStats.driverUtilization) === 0 && (
              <div className="flex items-center text-sm text-orange-600 mt-2">
                <XCircle className="mr-1" /> No Active Drivers
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-green-700 flex items-center">
              <Truck className="mr-2" /> Active Vehicles
            </CardTitle>
            <ChevronDown className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-800">
              {aggregateStats.activeVehicles}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance Section */}
      <div className="mt-8">
        <Card className="shadow-md hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 text-purple-600" />
              Driver Performance Trends
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Filter size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mockData.driverPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6B7280" }}
                  label={{
                    value: "Month",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#6B7280",
                  }}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Rating",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#6B7280",
                  }}
                  tick={{ fill: "#6B7280" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Trips",
                    angle: 90,
                    position: "insideRight",
                    fill: "#6B7280",
                  }}
                  tick={{ fill: "#6B7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="right"
                  dataKey="rides"
                  barSize={20}
                  fill="#8884d8"
                  name="Number of Trips"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rating"
                  stroke="#82ca9d"
                  name="Average Rating"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Users Section */}
      <div className="mt-8">
        <Card className="shadow-md hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Rated Drivers</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left border-b bg-gray-100">
                  <th className="py-3 pl-4">Driver</th>
                  <th>Routes</th>
                  <th>Rating</th>
                  <th>Feedback</th>
                  <th className="pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockData.topUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      selectedDriver === user.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="py-3 pl-4 flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.id}
                        className="rounded-full w-10 h-10 border-2 border-blue-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.id}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-gray-700">
                        <MapPin size={16} className="mr-2 text-blue-500" />
                        {user.startRoute} → {user.endRoute}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500 mr-1" />
                        <span className="font-medium text-gray-700">
                          {user.rating}
                        </span>
                      </div>
                    </td>
                    <td>{renderFeedbackBadge(user.feedback)}</td>
                    <td className="pr-4">
                      <button
                        onClick={() => handleDriverSelect(user.id)}
                        className="hover:bg-gray-200 p-2 rounded-full transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default VehicleManagement;
