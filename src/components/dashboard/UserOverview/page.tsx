"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/base/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/base/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/base/select";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, Car, Timer, DollarSign, Star, Route, Calendar,
  TrendingUp, UserCheck, MapPin, Clock, Activity
} from 'lucide-react';


interface MetricCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon: JSX.Element;
  }

const timeRanges = ['24h', '7d', '30d', '90d'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Sample data - replace with API calls
  const rideMetrics = {
    totalRides: 850,
    averageRides: 25,
    cancellationRate: "5%",
    timeToFill: "8 mins",
    rideDistance: "12 km",
    rideDuration: "28 mins"
  };

  const driverMetrics = {
    totalDrivers: 200,
    activeDrivers: 150,
    acceptanceRate: "87%",
    availability: "75%",
    averageEarnings: "$250/day",
    utilization: "82%"
  };

  const userMetrics = {
    activeUsers: 1250,
    registeredUsers: 5000,
    growthRate: "15%",
    riderToDriverRatio: "4:1"
  };

  const rideData = [
    { date: '2024-01', completed: 850, cancelled: 42, pending: 15 },
    { date: '2024-02', completed: 920, cancelled: 38, pending: 18 },
    { date: '2024-03', completed: 880, cancelled: 45, pending: 12 },
    { date: '2024-04', completed: 950, cancelled: 35, pending: 20 }
  ];

  const driverPerformance = [
    { range: '0-10', drivers: 20 },
    { range: '11-20', drivers: 45 },
    { range: '21-30', drivers: 60 },
    { range: '31-40', drivers: 35 },
    { range: '40+', drivers: 15 }
  ];

  const timeDistribution = [
    { name: 'Morning', value: 35 },
    { name: 'Afternoon', value: 25 },
    { name: 'Evening', value: 30 },
    { name: 'Night', value: 10 }
  ];

  const earningsData = [
    { date: 'Mon', earnings: 2400, rides: 120 },
    { date: 'Tue', earnings: 2800, rides: 140 },
    { date: 'Wed', earnings: 3200, rides: 160 },
    { date: 'Thu', earnings: 2600, rides: 130 },
    { date: 'Fri', earnings: 3600, rides: 180 },
    { date: 'Sat', earnings: 4000, rides: 200 },
    { date: 'Sun', earnings: 3000, rides: 150 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kwik Ride Analytics</h1>
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rides">Rides</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Users"
              value={userMetrics.activeUsers}
              change="+12%"
              icon={<Users className="h-6 w-6" />}
            />
            <MetricCard
              title="Total Rides"
              value={rideMetrics.totalRides}
              change="+8%"
              icon={<Car className="h-6 w-6" />}
            />
            <MetricCard
              title="Active Drivers"
              value={driverMetrics.activeDrivers}
              change="+5%"
              icon={<UserCheck className="h-6 w-6" />}
            />
            <MetricCard
              title="Average Earnings"
              value={driverMetrics.averageEarnings}
              change="+15%"
              icon={<DollarSign className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ride Trends</CardTitle>
                <CardDescription>Completed vs Cancelled Rides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rideData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="completed" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="cancelled" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="pending" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Distribution</CardTitle>
                <CardDescription>Driver earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="earnings" stroke="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="rides" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rides Tab */}
        <TabsContent value="rides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Average Duration"
              value={rideMetrics.rideDuration}
              icon={<Clock className="h-6 w-6" />}
            />
            <MetricCard
              title="Average Distance"
              value={rideMetrics.rideDistance}
              icon={<Route className="h-6 w-6" />}
            />
            <MetricCard
              title="Time to Fill"
              value={rideMetrics.timeToFill}
              icon={<Timer className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ride Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rideData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cancelled" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Acceptance Rate"
              value={driverMetrics.acceptanceRate}
              icon={<Star className="h-6 w-6" />}
            />
            <MetricCard
              title="Availability"
              value={driverMetrics.availability}
              icon={<Activity className="h-6 w-6" />}
            />
            <MetricCard
              title="Utilization"
              value={driverMetrics.utilization}
              icon={<TrendingUp className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={driverPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="drivers" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Earnings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Registered Users"
              value={userMetrics.registeredUsers}
              icon={<Users className="h-6 w-6" />}
            />
            <MetricCard
              title="Growth Rate"
              value={userMetrics.growthRate}
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <MetricCard
              title="Rider:Driver Ratio"
              value={userMetrics.riderToDriverRatio}
              icon={<UserCheck className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rideData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="completed" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            
            <Card>
              <CardHeader>
                <CardTitle>User Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};



const MetricCard = ({ title, value, change, icon }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className={`text-xs ${
          change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {change} from last period
        </p>
      )}
    </CardContent>
  </Card>
);

export default AnalyticsDashboard;