// File: src/components/settings/SecurityTab.tsx
import React, { useState } from "react";
import { Lock, Key, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/base/switch";
import { Progress } from "@/components/ui/base/progress";
import { validatePassword } from "@/utils/validation";
import { UserData } from "@/types/settings-user";
import { Label } from "recharts";

interface SecurityTabProps {
  userData: UserData;
  onUpdateSecurity: (updates: Partial<UserData>) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  userData,
  onUpdateSecurity,
}) => {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validation = validatePassword(newPassword);
    setPasswordStrength(validation.strength);
  };

  function handleRemoveDevice(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Lock className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch
          checked={userData.twoFactorAuth}
          onCheckedChange={(checked) =>
            onUpdateSecurity({ twoFactorAuth: checked })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={handlePasswordChange}
          id={""}
        />
        <Progress value={passwordStrength} className="w-full" />
        <p className="text-sm text-gray-500">
          Password strength: {passwordStrength}%
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Login History</h3>
        {userData.loginHistory?.slice(0, 5).map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span>{new Date(entry.timestamp).toLocaleString()}</span>
            <span>{entry.deviceInfo}</span>
            <span
              className={
                entry.status === "success" ? "text-green-500" : "text-red-500"
              }
            >
              {entry.status}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Connected Devices</h3>
        {userData.deviceHistory?.map((device) => (
          <div key={device.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{device.deviceName}</p>
              <p className="text-sm text-gray-500">
                {device.browser} on {device.os}
              </p>
            </div>
            {!device.isCurrent && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveDevice(device.id)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
