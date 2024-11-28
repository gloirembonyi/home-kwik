import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Star 
} from "lucide-react";
import { LineChartComponent } from "./Line";
import { ProfitBarChart } from "./bar";

const AnalyticsPageRide = () => {
  const [timePeriod, setTimePeriod] = useState("This Month");

  // Stat Card Component for reusability
  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    className = "", 
    trend = null 
  }: { 
    icon: React.ElementType, 
    title: string, 
    value: string, 
    className?: string, 
    trend?: { 
      percentage: number, 
      direction: 'up' | 'down' 
    } | null 
  }) => (
    <Card className={`bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-sm font-medium text-gray-500">
              {title}
            </CardTitle>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend.direction === 'up' ? '▲' : '▼'} {trend.percentage}%
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen">
      {/* Header Stats Section with Enhanced Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard 
          icon={CreditCard}
          title="Total Revenue"
          value="152 RWF"
          trend={{ percentage: 25.3, direction: 'up' }}
        />
        <StatCard 
          icon={TrendingUp}
          title="Total Rides"
          value="100"
          trend={{ percentage: 15.2, direction: 'up' }}
        />
        <StatCard 
          icon={Users}
          title="Active Drivers"
          value="321"
          trend={{ percentage: 10.5, direction: 'up' }}
        />
        <StatCard 
          icon={Star}
          title="Avg. Satisfaction"
          value="32.1"
          trend={{ percentage: 5.1, direction: 'down' }}
        />
      </div>

      {/* Analytics Line Chart Section */}
      <Card className="bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Rides & Revenue Analytics
          </CardTitle>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="rounded-md border-gray-300 text-sm text-gray-600 px-3 py-1 hover:border-blue-500 transition-colors"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>
        </CardHeader>
        <div className="p-6">
        <LineChartComponent timePeriod="This Month" />
        </div>
      </Card>

      {/* Profit Bar Chart Section */}
      <Card className="bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Profit Breakdown
          </CardTitle>
          <div className="text-green-500 text-sm font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +25.3%
          </div>
        </CardHeader>
        <div className="p-6">
          <ProfitBarChart timePeriod={timePeriod} />
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPageRide;