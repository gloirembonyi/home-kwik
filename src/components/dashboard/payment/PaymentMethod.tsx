import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/base/card";
import {
  WalletIcon,
  CreditCardIcon,
  PhoneIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/base/switch";

const PaymentMethod = () => {
  const paymentMethods = [
    {
      id: "cash",
      name: "Cash",
      balance: "-1,540.50 RWF",
      icon: WalletIcon,
      description: "Pay with cash",
      active: true,
    },
    {
      id: "kwik",
      name: "KWIK Wallet",
      balance: "-400.50 RWF",
      icon: CreditCardIcon,
      description: "Pay with KWIK wallet",
      active: false,
    },
    {
      id: "mobile",
      name: "Mobile Money",
      balance: "-700.00 RWF",
      icon: PhoneIcon,
      description: "Pay with Mobile Money",
      active: false,
    },
  ];

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div>
          <CardTitle className="text-xl font-bold">Payment Methods</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total Balance: 25,215 RWF
          </p>
        </div>
        <button className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
          <MoreVerticalIcon className="h-4 w-4 text-primary" />
        </button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors",
                method.active && "bg-primary/5 border-primary"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {React.createElement(method.icon, {
                    className: "h-5 w-5 text-primary",
                  })}
                </div>
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "font-medium",
                    method.balance.startsWith("-")
                      ? "text-red-500"
                      : "text-green-500"
                  )}
                >
                  {method.balance}
                </span>
                <Switch checked={method.active} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
