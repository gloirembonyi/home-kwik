"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { ArrowUpRight, ArrowDownRight, Car, Users, Clock, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RideStatistics = () => {
  const stats = [
    {
      title: "Total Rides",
      value: "2,847",
      change: "+12.5%",
      isPositive: true,
      icon: <Car className="h-4 w-4" />
    },
    {
      title: "Active Riders",
      value: "1,249",
      change: "+18.2%",
      isPositive: true,
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Avg. Trip Duration",
      value: "24 min",
      change: "-2.1%",
      isPositive: false,
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: "Revenue",
      value: "$42,890",
      change: "+22.4%",
      isPositive: true,
      icon: <DollarSign className="h-4 w-4" />
    }
  ];

  const chartData = [
    { name: 'Mon', rides: 145 },
    { name: 'Tue', rides: 232 },
    { name: 'Wed', rides: 186 },
    { name: 'Thu', rides: 256 },
    { name: 'Fri', rides: 378 },
    { name: 'Sat', rides: 342 },
    { name: 'Sun', rides: 214 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="bg-gray-100 p-2 rounded-lg">{stat.icon}</span>
                <span className={`text-sm flex items-center gap-1 ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Ride Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rides" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideStatistics;