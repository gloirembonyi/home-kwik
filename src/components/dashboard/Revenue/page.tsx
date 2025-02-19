"use client";

import React from "react";
import { Card } from "@/components/ui/base/card";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import StatsCard from "./StatsCard";
import SalesRevenueChart from "./SalesRevenueChart";
import RevenueByLocation from "./RevenueByLocation";
import RidesPerPaymentMethod from "./RidesPerPaymentMethod";
import DriverEarnings from "./DriverEarnings";

export default function RevenuePage() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9">
          {/* Header with Sort */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Today's Stats</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort By:</span>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border hover:bg-accent/50 transition-colors">
                Today
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <StatsCard
              title="Total Revenue"
              value="152 RWF"
              icon={
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L19 21H5L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
              className="bg-red-50/50 dark:bg-red-900/5"
            />
            <StatsCard
              title="Driver Earnings"
              value="99.7 RWF"
              icon={
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 8V16M8 12H16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              }
              className="bg-orange-50/50 dark:bg-orange-900/5"
            />
            <StatsCard
              title="Platform Commission"
              value="32.1 RWF"
              icon={
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
              className="bg-emerald-50/50 dark:bg-emerald-900/5"
            />
          </div>

          {/* Sales Revenue Chart */}
          <Card className="p-5 dark:bg-background/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sales Revenue</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sort By:
                  </span>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border hover:bg-accent/50 transition-colors">
                    Today
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Filter By:
                  </span>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border hover:bg-accent/50 transition-colors">
                    Country
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            <SalesRevenueChart />
          </Card>
        </div>
        {/* Right Side Components */}
        <div className="col-span-3">
          {/* Driver Earnings */}
          <Card className="p-5 dark:bg-background/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Driver Earnings</h3>
              <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <DriverEarnings />
          </Card>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Revenue by Location */}
        <div className="col-span-9">
          <RevenueByLocation />
        </div>

        {/* Right Side Components */}
        <div className="col-span-3 space-y-5">
          {/* Rides per Payment Method */}
          <Card className="p-5 dark:bg-background/50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                Rides per payment method
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on selected period
              </p>
            </div>
            <RidesPerPaymentMethod />
          </Card>
        </div>
      </div>
    </div>
  );
}
