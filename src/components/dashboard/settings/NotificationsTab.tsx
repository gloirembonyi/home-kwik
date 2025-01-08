// src/components/settings/NotificationsTab.tsx
import React from "react";
import { Bell, Mail, Smartphone, Clock } from "lucide-react";
import { Switch } from "@/components/ui/base/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Card, CardContent } from "@/components/ui/base/card";
import { Label } from "@/components/ui/base/label";
import { Input } from "@/components/ui/Input";
import { UserData, NotificationSettings } from "@/types/settings-user";

interface NotificationsTabProps {
  userData: UserData;
  onUpdateNotifications: (updates: Partial<NotificationSettings>) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  userData,
  onUpdateNotifications,
}) => {
  const handleEmailToggle = (key: keyof NotificationSettings["email"]) => {
    onUpdateNotifications({
      email: {
        ...userData.notifications.email,
        [key]: !userData.notifications.email[key],
      },
    });
  };

  const handlePushToggle = (key: keyof NotificationSettings["push"]) => {
    onUpdateNotifications({
      push: {
        ...userData.notifications.push,
        [key]: !userData.notifications.push[key],
      },
    });
  };

  const handleQuietHoursChange = (
    field: keyof NotificationSettings["quiet_hours"],
    value: string | boolean
  ) => {
    onUpdateNotifications({
      quiet_hours: {
        ...userData.notifications.quiet_hours,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Mail className="text-gray-500" />
            <h3 className="font-semibold">Email Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Security Alerts</Label>
              <Switch
                checked={userData.notifications.email.security}
                onCheckedChange={() => handleEmailToggle("security")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Product Updates</Label>
              <Switch
                checked={userData.notifications.email.updates}
                onCheckedChange={() => handleEmailToggle("updates")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Marketing Communications</Label>
              <Switch
                checked={userData.notifications.email.marketing}
                onCheckedChange={() => handleEmailToggle("marketing")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Newsletter</Label>
              <Switch
                checked={userData.notifications.email.newsletter}
                onCheckedChange={() => handleEmailToggle("newsletter")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Smartphone className="text-gray-500" />
            <h3 className="font-semibold">Push Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Security Alerts</Label>
              <Switch
                checked={userData.notifications.push.security}
                onCheckedChange={() => handlePushToggle("security")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Product Updates</Label>
              <Switch
                checked={userData.notifications.push.updates}
                onCheckedChange={() => handlePushToggle("updates")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Reminders</Label>
              <Switch
                checked={userData.notifications.push.reminders}
                onCheckedChange={() => handlePushToggle("reminders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Messages</Label>
              <Switch
                checked={userData.notifications.push.messages}
                onCheckedChange={() => handlePushToggle("messages")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Bell className="text-gray-500" />
            <h3 className="font-semibold">Notification Preferences</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select
                value={userData.notifications.frequency}
                onValueChange={(value: "immediate" | "daily" | "weekly") =>
                  onUpdateNotifications({ frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Quiet Hours</Label>
                <Switch
                  checked={userData.notifications.quiet_hours.enabled}
                  onCheckedChange={(checked) =>
                    handleQuietHoursChange("enabled", checked)
                  }
                />
              </div>
              {userData.notifications.quiet_hours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={userData.notifications.quiet_hours.start}
                      onChange={(e) =>
                        handleQuietHoursChange("start", e.target.value)
                      }
                      id={""}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={userData.notifications.quiet_hours.end}
                      onChange={(e) =>
                        handleQuietHoursChange("end", e.target.value)
                      }
                      id={""}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
