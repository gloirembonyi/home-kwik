import React from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/base/avatar";

interface EarningUser {
  name: string;
  time: string;
  amount: string;
  isPositive: boolean;
  avatarUrl: string;
}

const TopEarningUsers = () => {
  const users: EarningUser[] = [
    {
      name: "Alex Mandana",
      time: "Today, 16:36",
      amount: "+50 RWF",
      isPositive: true,
      avatarUrl: "/avatars/01.png",
    },
    {
      name: "Laura Kampiriki",
      time: "Today, 08:49",
      amount: "-27 RWF",
      isPositive: false,
      avatarUrl: "/avatars/02.png",
    },
    {
      name: "Jadon Samuel",
      time: "Yesterday, 14:36",
      amount: "+157 RWF",
      isPositive: true,
      avatarUrl: "/avatars/03.png",
    },
    {
      name: "Jadon Samuel",
      time: "Yesterday, 14:36",
      amount: "+157 RWF",
      isPositive: true,
      avatarUrl: "/avatars/03.png",
    },
  ];

  return (
    <Card className="bg-background rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            Top Earning Users
          </h2>
          <button className="text-sm text-primary hover:underline">
            View all →
          </button>
        </div>
        <div className="space-y-5">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.time}</p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  user.isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {user.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopEarningUsers;
