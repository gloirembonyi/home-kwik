import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import { Input } from "@/components/ui/Input";
import { Bell } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";
import PaymentMethod from "./PaymentMethod";
import GradientLineChart from "./GradientLineChart";
import TopEarningUsers from "./TopEarningUsers";
import PriceDistanceForm from "./PriceDistanceForm";

interface StatsCardProps {
  description: string;
  value: string;
  icon: React.ReactNode;
  chart?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  description,
  value,
  icon,
  chart,
}) => {
  return (
    <div className="flex flex-col items-start bg-background p-5 rounded-2xl shadow-sm w-full border border-border/50">
      <div className="flex items-center w-full justify-between mb-4">
        <p className="text-sm text-muted-foreground font-medium">
          {description}
        </p>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/5">
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        {chart && <div className="w-24 h-10">{chart}</div>}
      </div>
    </div>
  );
};

const PaymentDashboard = () => {
  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          description="Description"
          value="682.5 RWF"
          icon={
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L19 21H5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          chart={
            <svg className="w-full h-full text-primary/20" viewBox="0 0 100 40">
              <path
                d="M0 20 Q25 5, 50 25 T100 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          }
        />
        <StatsCard
          description="Description"
          value="32.1 RWF"
          icon={
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L19 21H5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <StatsCard
          description="Description"
          value="682.5 RWF"
          icon={
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L19 21H5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          chart={
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <path
                d="M0 30 L20 25 L40 35 L60 20 L80 30 L100 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          }
        />
        <StatsCard
          description="Description"
          value="32.1 RWF"
          icon={
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L19 21H5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>

      {/* First Row: Chart Card (4/6) and Top Earning Users (2/6) */}
      <div className="grid grid-cols-6 gap-6">
        {/* Chart Card */}
        <Card className="bg-background col-span-4 rounded-2xl">
          <CardContent className="p-5">
            <GradientLineChart />
          </CardContent>
        </Card>

        {/* Top Earning Users */}
        <div className="col-span-2">
          <TopEarningUsers />
        </div>
      </div>

      {/* Second Row: Payment Methods (2/6) and Price Distance Form (4/6) */}
      <div className="grid grid-cols-6 gap-5">
        {/* Payment Methods */}
        <div className="col-span-2">
          <PaymentMethod />
        </div>

        {/* Price Distance Form */}
        <div className="col-span-4">
          <PriceDistanceForm />
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
