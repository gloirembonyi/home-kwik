import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import PaymentMethod from "./PaymentMethod";
import GradientLineChart from "./GradientLineChart";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";

const PaymentDashboard = () => {
  const statsCards = [
    {
      title: "Total Balance",
      value: "682.5K RWF",
      change: "+2.45%",
      trend: "up",
      chart: "wave",
    },
    {
      title: "Total Spending",
      value: "432.1K RWF",
      change: "-1.35%",
      trend: "down",
      chart: "wave",
    },
    {
      title: "Total Saved",
      value: "250.4K RWF",
      change: "+1.10%",
      trend: "up",
      chart: "bars",
    },
    {
      title: "Total Investment",
      value: "145.2K RWF",
      change: "+3.20%",
      trend: "up",
      chart: "bars",
    },
  ];

  const distanceData = [
    { distance: "1 KM", priceRange: "2000 RWF - 5000 RWF", duration: "5.0" },
    { distance: "5 KM", priceRange: "2000 RWF - 5000 RWF", duration: "3.0" },
    { distance: "10 KM", priceRange: "2000 RWF - 5000 RWF", duration: "1.0" },
    { distance: "15 KM", priceRange: "2000 RWF - 5000 RWF", duration: "5.0" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card
            key={index}
            className="bg-card hover:bg-accent/10 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div
                className={`flex items-center gap-1 ${
                  card.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.trend === "up" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                <span className="text-sm">{card.change}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.chart === "wave" && (
                <div className="mt-4 h-[80px]">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <defs>
                      <linearGradient
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--chart-1)"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--chart-1)"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 20 Q25 5, 50 25 T100 20"
                      fill="none"
                      stroke="var(--chart-1)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 20 Q25 5, 50 25 T100 20 V40 H0 Z"
                      fill={`url(#gradient-${index})`}
                    />
                  </svg>
                </div>
              )}
              {card.chart === "bars" && (
                <div className="mt-4 h-[80px] flex items-end justify-between gap-2">
                  {[0.4, 0.6, 0.8, 0.6, 0.4].map((height, i) => (
                    <div
                      key={i}
                      className="w-full bg-primary/20 rounded-t"
                      style={{ height: `${height * 100}%` }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div>
              <CardTitle className="text-xl font-bold">Statistics</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monthly Income Overview
              </p>
            </div>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-6">
            <GradientLineChart />
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <PaymentMethod />
      </div>

      {/* Distance and Price Table */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="text-xl font-bold">
              Distance & Price
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of distance and price ranges
            </p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-4 font-medium text-muted-foreground">
                    Distance
                  </th>
                  <th className="text-left pb-4 font-medium text-muted-foreground">
                    Price Range
                  </th>
                  <th className="text-left pb-4 font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="text-right pb-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {distanceData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-accent/5"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <WalletIcon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{item.distance}</span>
                      </div>
                    </td>
                    <td className="py-4">{item.priceRange}</td>
                    <td className="py-4">{item.duration} min</td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-accent/50">
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-accent/50">
                          <PencilIcon className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-accent/50">
                          <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDashboard;
