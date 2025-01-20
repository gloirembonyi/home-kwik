import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";

interface DriverEarning {
  id: number;
  name: string;
  amount: string;
  rating: number;
  avatar: string;
}

const DriverEarnings = () => {
  const drivers: DriverEarning[] = [
    {
      id: 1,
      name: "Aime KARAKE",
      amount: "2,500 RWF",
      rating: 5.0,
      avatar: "/avatars/01.png",
    },
    {
      id: 2,
      name: "Jean Paul",
      amount: "1,800 RWF",
      rating: 4.8,
      avatar: "/avatars/02.png",
    },
    {
      id: 3,
      name: "Marie Claire",
      amount: "1,650 RWF",
      rating: 4.9,
      avatar: "/avatars/03.png",
    },
    {
      id: 4,
      name: "Eric Mugisha",
      amount: "1,450 RWF",
      rating: 4.7,
      avatar: "/avatars/04.png",
    },
    {
      id: 5,
      name: "Alice Uwase",
      amount: "1,200 RWF",
      rating: 4.6,
      avatar: "/avatars/05.png",
    },
  ];

  return (
    <div className="space-y-4">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={driver.avatar} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {driver.name}
              </p>
              <p className="text-xs text-muted-foreground">{driver.amount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-500">
              {driver.rating}
            </span>
            <span className="text-xs text-muted-foreground">Rating</span>
            <span className="text-xs text-muted-foreground font-medium">
              #{driver.id}
            </span>
          </div>
        </div>
      ))}
      <button className="w-full text-sm text-primary hover:underline mt-2">
        See All →
      </button>
    </div>
  );
};

export default DriverEarnings;
