"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Award, ThumbsUp, AlertTriangle } from "lucide-react";

const DriverPerformance = () => {
  const topDrivers = [
    {
      name: "John Smith",
      rides: 145,
      rating: 4.9,
      earnings: "$1,890",
      status: "Active"
    },
    {
      name: "Maria Garcia",
      rides: 132,
      rating: 4.8,
      earnings: "$1,740",
      status: "Active"
    },
    {
      name: "David Chen",
      rides: 128,
      rating: 4.8,
      earnings: "$1,680",
      status: "Active"
    }
  ];

  const performanceData = [
    { month: 'Jan', completedRides: 850, cancelledRides: 42 },
    { month: 'Feb', completedRides: 920, cancelledRides: 38 },
    { month: 'Mar', completedRides: 880, cancelledRides: 45 },
    { month: 'Apr', completedRides: 990, cancelledRides: 32 },
    { month: 'May', completedRides: 1100, cancelledRides: 28 },
    { month: 'Jun', completedRides: 1200, cancelledRides: 25 }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <h3 className="text-sm font-medium">Average Rating</h3>
            </div>
            <p className="text-2xl font-bold mt-4">4.8/5.0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-medium">Top Performer</h3>
            </div>
            <p className="text-2xl font-bold mt-4">John Smith</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4 text-green-400" />
              <h3 className="text-sm font-medium">Completion Rate</h3>
            </div>
            <p className="text-2xl font-bold mt-4">96.8%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-medium">Issues Reported</h3>
            </div>
            <p className="text-2xl font-bold mt-4">12</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{driver.rating}</span>
                      <span>•</span>
                      <span>{driver.rides} rides</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{driver.earnings}</p>
                    <span className="text-sm text-green-500">{driver.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ride Completion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completedRides" fill="#3b82f6" name="Completed" />
                  <Bar dataKey="cancelledRides" fill="#ef4444" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverPerformance;