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
import { cn } from "@/components/lib/utils";
import axios from "axios";

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const getFrequentUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/mobile/all?page=0&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Fetching error:", error);
    } finally {
      console.log("Fetching users completed.");
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <main className="space-y-6">
          {/* Stats card on dashboard */}
          <StatsDashboard />

          {/* Rides Overview Chart */}
          <RidesOverviewChart />

          {/* Frequent Users Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between bg-card p-6">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Frequent Users
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Users with highest ride counts
                </p>
              </div>
              <button
                className="text-primary hover:text-primary/90 text-sm hover:underline font-semibold"
                onClick={() => onNavigate("/users")}
              >
                View All Users
              </button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="py-4 px-4 text-muted-foreground font-medium">
                        User Name
                      </th>
                      <th className="py-4 px-4 text-muted-foreground font-medium">
                        Role
                      </th>
                      <th className="py-4 px-4 text-muted-foreground font-medium">
                        Gender
                      </th>
                      <th className="py-4 px-4 text-muted-foreground font-medium">
                        Total Rides
                      </th>
                      <th className="py-4 px-4 text-muted-foreground font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                              {user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium text-foreground">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {user.role}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {user.gender}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {user.rides}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              user.status === "Active"
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            )}
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

export default OverviewDashboard;
