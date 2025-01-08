// File: src/components/settings/PrivacyTab.tsx
import React, { useState } from "react";
import { Shield, Eye, Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Switch } from "@/components/ui/base/switch";
import { UserData } from "@/types/settings-user";

interface PrivacyTabProps {
  userData: UserData;
  onUpdatePrivacy: (updates: Partial<UserData>) => void;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  userData,
  onUpdatePrivacy,
}) => {
  const [dataSharing, setDataSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Shield className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Privacy Level</h3>
          <p className="text-sm text-gray-500">
            Control your account's visibility and data usage
          </p>
        </div>
        <Select
          value={userData.privacyLevel}
          onValueChange={(value: "low" | "medium" | "high") =>
            onUpdatePrivacy({ privacyLevel: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Public Profile</SelectItem>
            <SelectItem value="medium">Medium - Friends Only</SelectItem>
            <SelectItem value="high">High - Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <Eye className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Data Sharing</h3>
          <p className="text-sm text-gray-500">
            Control how your data is shared with our services
          </p>
        </div>
        <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
      </div>

      <div className="flex items-center space-x-4">
        <Bell className="text-gray-500" />
        <div className="flex-grow">
          <h3 className="font-semibold">Activity Tracking</h3>
          <p className="text-sm text-gray-500">
            Control how we track your activity for better service
          </p>
        </div>
        <Switch
          checked={activityTracking}
          onCheckedChange={setActivityTracking}
        />
      </div>
    </div>
  );
};
