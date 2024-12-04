"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

const GrowthAnalysis = () => {
  const growthMetrics = [
    {
      title: "User Growth Rate",
      value: "+24.6%",
      description: "vs last month",
      icon: <TrendingUp className="h-4 w-4 text-green-400" />
    },
    {
      title: "New Users",
      value: "1,429",
      description: "this month",
      icon: <Users className="h-4 w-4 text-blue-400" />
    },
    {
      title: "Revenue Growth",
      value: "+32.8%",
      description: "vs last month",
      icon: <DollarSign className="h-4 w-4 text-yellow-400" />
    },
    {
      title: "Market Share",
      value: "28.5%",
      description: "in target region",
      icon: <Target className="h-4 w-4 text-purple-400" />
    }
  ];

  const growthData = [
    { month: 'Jan', users: 2400, revenue: 35000 },
    { month: 'Feb', users: 2800, revenue: 42000 },
    { month: 'Mar', users: 3200, revenue: 48000 },
    { month: 'Apr', users: 3800, revenue: 56000 },
    { month: 'May', users: 4500, revenue: 68000 },
    { month: 'Jun', users: 5200, revenue: 82000 }
  ];

  const marketShareData = [
    { month: 'Jan', share: 18 },
    { month: 'Feb', share: 20 },
    { month: 'Mar', share: 22 },
    { month: 'Apr', share: 24 },
    { month: 'May', share: 26 },
    { month: 'Jun', share: 28.5 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {growthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {metric.icon}
                <span className="text-sm text-gray-500">{metric.description}</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    name="Users"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Share Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="share"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    name="Market Share %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GrowthAnalysis;