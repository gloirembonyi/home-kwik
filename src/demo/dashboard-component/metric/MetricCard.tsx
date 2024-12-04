// components/MetricCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/base/dialog";
import { Skeleton } from "@/components/ui/base/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  loading?: boolean;
  details?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, loading = false, details }) => {
  const isPositive = change >= 0;

  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg border border-gray-200">
      <CardHeader className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          {loading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
          )}
          <div className="flex items-center mt-1">
            {loading ? (
              <Skeleton className="h-4 w-10" />
            ) : (
              <>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : '-'}{Math.abs(change)}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Details button with dialog */}
        {details && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-blue-500 hover:underline">Details</button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{title} Details</DialogTitle>
              </DialogHeader>
              <div className="mt-2">{details}</div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
