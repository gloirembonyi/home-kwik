import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import { CreditCard, MoreHorizontal } from "lucide-react";

interface PaymentMethodItem {
  icon: React.ReactNode;
  name: string;
  amount: string;
}

const PaymentMethod = () => {
  const paymentMethods: PaymentMethodItem[] = [
    {
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1 10H23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      name: "Credit Card",
      amount: "2,000,000 RWF",
    },
    {
      icon: (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1V23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      name: "Mobile Money",
      amount: "1,500,000 RWF",
    },
    {
      icon: <CreditCard className="w-4 h-4 text-orange-500" />,
      name: "Bank Transfer",
      amount: "500,000 RWF",
    },
  ];

  // Calculate total balance
  const totalBalance = "4,000,000 RWF";

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium opacity-90">Total Balance</p>
            {/* three dots */}
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <h1 className="text-2xl font-bold">{totalBalance}</h1>
            <svg
              width="100"
              height="40"
              viewBox="0 0 100 40"
              className="text-white/30"
            >
              <path
                d="M0 30 Q25 10, 50 25 T100 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-5 space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  {method.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{method.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Payment Method
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">{method.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
