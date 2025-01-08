"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import RidesOverviewChart from "./rides/RidesOverview";
import StatsDashboard from "./rides/charts/StatsDashboard";

type TimeRange = "day" | "week" | "month" | "quarter";

interface OverviewDashboardProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentPath,
  onNavigate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  return (
    <div className="flex">
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <main className="space-y-6">
          {/* Stats card on dashboard */}
          <StatsDashboard />

          {/* Rides Overview Chart */}
          <RidesOverviewChart />

          {/* Frequent Users Table */}
          <Card className="shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white p-6">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Frequent Users
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Users with highest ride counts
                </p>
              </div>
              {/* Navigation handled via onNavigate */}
              <button
                className="text-blue-600 text-sm hover:underline font-semibold"
                onClick={() => onNavigate("/users")}
              >
                View All Users
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-200">
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        User Name
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Role
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Gender
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Total Rides
                      </th>
                      <th className="py-4 px-4 text-slate-500 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFrequentUsers().map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center text-white font-semibold shadow-md">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium text-slate-800">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.role}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.gender}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {user.rides}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
// StatsCard Component
interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  lastUpdate: string;
}

// Helper functions

const getFrequentUsers = () => [
  {
    name: "Leasie Watson",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
  {
    name: "Darlene Robertson",
    role: "Driver",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Jacob Jones",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Kathryn Murphy",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Leslie Alexander",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
  {
    name: "Ronald Richards",
    role: "Rider",
    gender: "Male",
    rides: 200,
    status: "Active",
  },
  {
    name: "Jenny Wilson",
    role: "Driver",
    gender: "Female",
    rides: 200,
    status: "Active",
  },
];

export default OverviewDashboard;
