import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethod {
  method: string;
  value: number;
  color: string;
  amount: string;
}

const RidesPerPaymentMethod = () => {
  const paymentMethods: PaymentMethod[] = [
    { method: "CASH", value: 14859, color: "#E5E7EB", amount: "14,859.00 RWF" },
    {
      method: "KWIK-WALLET",
      value: 35690,
      color: "#60A5FA",
      amount: "35,690.00 RWF",
    },
    {
      method: "MOBILE MONEY",
      value: 45120,
      color: "#1E40AF",
      amount: "45,120.00 RWF",
    },
    {
      method: "CREDIT CARD",
      value: 25486,
      color: "#F59E0B",
      amount: "25,486.00 RWF",
    },
  ];

  const data = {
    datasets: [
      {
        data: paymentMethods.map((pm) => pm.value),
        backgroundColor: paymentMethods.map((pm) => pm.color),
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="space-y-6">
      <div className="relative w-40 h-40 mx-auto">
        <Doughnut data={data} options={options} />
      </div>
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: method.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {method.method}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {method.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RidesPerPaymentMethod;
