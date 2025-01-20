import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import PaymentMethod from "./PaymentMethod";
import { CreditCard, TrendingUp, Users, Star } from "lucide-react";
import GradientLineChart from "./GradientLineChart";

interface CardProps {
  description: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<CardProps> = ({ description, value, icon }) => {
  return (
    <div className="flex flex-col items-start bg-background p-6 rounded-lg shadow-sm w-full border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="flex items-center w-full justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          {description}
        </p>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mt-4">{value}</h3>
    </div>
  );
};

const PaymentDashboard = () => {
  const statsCards = [
    {
      description: "Total Income",
      value: "682.5K RWF",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
    },
    {
      description: "Total Spending",
      value: "432.1K RWF",
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
    },
    {
      description: "Total Savings",
      value: "250.4K RWF",
      icon: <Users className="w-5 h-5 text-primary" />,
    },
    {
      description: "Total Investment",
      value: "145.2K RWF",
      icon: <Star className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <StatsCard
            key={index}
            description={card.description}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Card */}
        <Card className="bg-background p-6">
          <CardContent className="p-0">
            <GradientLineChart />
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <PaymentMethod />
      </div>
    </div>
  );
};

export default PaymentDashboard;
