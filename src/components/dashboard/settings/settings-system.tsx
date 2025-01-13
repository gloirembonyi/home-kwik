import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/base/card";
import { Label } from "@/components/ui/base/label";
import { Button } from "@/components/ui/base/button";
import { Switch } from "@/components/ui/base/switch";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/base/avatar";
import {
  MoreVertical,
  Mail,
  User,
  Camera,
  Shield,
  Bell,
  Smartphone,
  Settings,
  Users,
  Lock,
  LogOut,
  Laptop,
  Phone,
  Clock,
  Tablet,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import { cn } from "@/components/lib/utils";

interface UserSettings {
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
  passwordlessLogin: boolean;
  twoFactorAuth: boolean;
  notifications: {
    email: {
      productUpdates: boolean;
      securityUpdates: boolean;
    };
    phone: {
      securityUpdates: boolean;
    };
  };
  devices: Array<{
    id: string;
    device: string;
    browser: string;
    location: string;
    ipAddress: string;
    lastActive: Date;
    icon: any;
  }>;
  team: Array<{
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    avatar?: string;
  }>;
}

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

const getCurrentDeviceInfo = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  const deviceInfo = {
    browser: "Unknown",
    os: "Unknown",
    device: "Unknown",
    isCurrentDevice: true,
  };

  // Detect browser
  if (userAgent.indexOf("Chrome") > -1) {
    deviceInfo.browser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    deviceInfo.browser = "Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    deviceInfo.browser = "Firefox";
  } else if (userAgent.indexOf("Edge") > -1) {
    deviceInfo.browser = "Edge";
  }

  // Detect OS
  if (platform.indexOf("Win") > -1) {
    deviceInfo.os = "Windows";
    deviceInfo.device = "PC";
  } else if (platform.indexOf("Mac") > -1) {
    deviceInfo.os = "macOS";
    deviceInfo.device = platform.indexOf("iPad") > -1 ? "iPad" : "MacBook";
  } else if (platform.indexOf("Linux") > -1) {
    deviceInfo.os = "Linux";
    deviceInfo.device = "PC";
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    deviceInfo.os = "iOS";
    deviceInfo.device = platform.indexOf("iPad") > -1 ? "iPad" : "iPhone";
  } else if (userAgent.indexOf("Android") > -1) {
    deviceInfo.os = "Android";
    deviceInfo.device = "Android Device";
  }

  return deviceInfo;
};

const SettingSystem = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings>({
    id: "usr_123456",
    fullName: "Anika Visser",
    email: "anika.visser@kwik.io",
    profileImage: "/api/placeholder/100/100",
    passwordlessLogin: false,
    twoFactorAuth: false,
    notifications: {
      email: {
        productUpdates: true,
        securityUpdates: true,
      },
      phone: {
        securityUpdates: false,
      },
    },
    devices: [
      {
        id: "dev_1",
        device: "MacBook Pro 15",
        browser: "Chrome on macOS",
        location: "Montreal, CA",
        ipAddress: "192.168.1.1",
        lastActive: new Date(Date.now() - 5 * 60 * 1000),
        icon: Laptop,
      },
      {
        id: "dev_2",
        device: "iPhone 12",
        browser: "Safari on iOS",
        location: "Toronto, CA",
        ipAddress: "192.168.1.2",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: Phone,
      },
    ],
    team: [
      {
        id: "usr_1",
        name: "Cao Yu",
        email: "cao.yu@kwik.io",
        role: "OWNER",
      },
      {
        id: "usr_2",
        name: "Siegbert Gottfried",
        email: "siegbert.gottfried@kwik.io",
        role: "ADMIN",
      },
    ],
  });

  useEffect(() => {
    const deviceInfo = getCurrentDeviceInfo();
    const newDevice = {
      id: "current_device",
      device: deviceInfo.device,
      browser: `${deviceInfo.browser} on ${deviceInfo.os}`,
      location: "Current Location",
      ipAddress: "Loading...",
      lastActive: new Date(),
      icon: deviceInfo.device.includes("Mac")
        ? Laptop
        : deviceInfo.device.includes("iPhone")
        ? Phone
        : deviceInfo.device.includes("iPad")
        ? Tablet
        : Laptop,
      isCurrentDevice: true,
    };

    // Get IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setCurrentDevice({
          ...newDevice,
          ipAddress: data.ip,
        });
      })
      .catch(() => {
        setCurrentDevice(newDevice);
      });
  }, []);

  const tabs = [
    { id: "General", label: "General", icon: Settings },
    { id: "Devices", label: "Devices", icon: Laptop },
    { id: "Team", label: "Team", icon: Users },
    { id: "Notifications", label: "Notifications", icon: Bell },
    { id: "Security", label: "Security", icon: Shield },
  ];

  const renderGeneral = () => (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/40">
          <div className="absolute -bottom-12 left-6">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src={settings.profileImage} alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {settings.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="p-6 pt-16">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Basic details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update your photo and personal details here.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
              Change Photo
            </Button>
          </div>

          <div className="space-y-6 mt-8">
            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <div className="flex justify-between items-center mt-1">
                <Input
                  value={settings.fullName}
                  onChange={(e) =>
                    handleUpdateProfile("fullName", e.target.value)
                  }
                  className="max-w-md bg-muted/50"
                  id={"fullName"}
                  disabled={isLoading}
                />
                <Button variant="outline" size="sm" disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <div className="flex justify-between items-center mt-1">
                <Input
                  value={settings.email}
                  onChange={(e) => handleUpdateProfile("email", e.target.value)}
                  className="max-w-md bg-muted/50"
                  id={"email"}
                  disabled={isLoading}
                />
                <Button variant="outline" size="sm" disabled={isLoading}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Privacy Settings
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium mb-1 flex items-center gap-2 text-foreground">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  Passwordless login
                </p>
                <p className="text-sm text-muted-foreground">
                  Enable secure login without password
                </p>
              </div>
              <Switch
                checked={settings.passwordlessLogin}
                onCheckedChange={() => handleToggleSetting("passwordlessLogin")}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium mb-1 flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Two factor authentication
                </p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggleSetting("twoFactorAuth")}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Delete Account
              </h3>
              <p className="text-sm text-muted-foreground">
                Delete your account and all of your source data. This is
                irreversible.
              </p>
            </div>
            <Button
              variant="destructive"
              className="shrink-0"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeam = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Invite other members
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              You currently have for 2 admin seats.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Email address"
                  className="pl-10 w-full bg-muted/50"
                  id={"invite-email"}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                onClick={() => {
                  handleInviteTeamMember(inviteEmail);
                  setInviteEmail("");
                }}
                disabled={isLoading || !inviteEmail}
              >
                Send Invite
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-2 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                MEMBER
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                ROLE
              </span>
            </div>

            {settings.team.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarFallback className="text-primary font-medium">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full",
                      member.role === "OWNER"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {member.role}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted"
                    disabled={isLoading}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Email Notifications
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Product updates</p>
                <p className="text-sm text-muted-foreground">
                  News, announcements, and product updates.
                </p>
              </div>
              <Switch
                checked={settings.notifications.email.productUpdates}
                onCheckedChange={(checked) =>
                  handleUpdateNotification("email", "productUpdates", checked)
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Security updates</p>
                <p className="text-sm text-muted-foreground">
                  Important notifications about your account security.
                </p>
              </div>
              <Switch
                checked={settings.notifications.email.securityUpdates}
                onCheckedChange={(checked) =>
                  handleUpdateNotification("email", "securityUpdates", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Phone notifications
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Security updates</p>
                <p className="text-sm text-muted-foreground">
                  Important notifications about your account security.
                </p>
              </div>
              <Switch
                checked={settings.notifications.phone.securityUpdates}
                onCheckedChange={(checked) =>
                  handleUpdateNotification("phone", "securityUpdates", checked)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Laptop className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Connected Devices
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your connected devices and active sessions
              </p>
            </div>
          </div>

          {currentDevice && (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  CURRENT DEVICE
                </h4>
                <div className="flex justify-between items-center p-4 bg-primary/25 border border-primary rounded-lg">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <currentDevice.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium flex items-center gap-2">
                        {currentDevice.device}
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          Current
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentDevice.browser}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{currentDevice.location}</span>
                        <span>•</span>
                        <span>{currentDevice.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">
                      Active now
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  OTHER DEVICES
                </h4>
              </div>
            </>
          )}

          <div className="space-y-4">
            {settings.devices.map((device) => (
              <div
                key={device.id}
                className="flex justify-between items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/10 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <device.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{device.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {device.browser}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{device.location}</span>
                      <span>•</span>
                      <span>{device.ipAddress}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatTimeAgo(device.lastActive)}
                  </p>
                  <Button
                    variant="link"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRevokeDevice(device.id)}
                    disabled={isLoading}
                  >
                    Revoke access
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {settings.devices.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No other devices connected
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Change password
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <Input
              type="password"
              value="Thebestpasswordever123#"
              className="max-w-md bg-muted/50"
              id={"password"}
            />
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Multi Factor Authentication
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Authenticator App",
                description:
                  "Use an authenticator app to generate one time security codes.",
                icon: Smartphone,
              },
              {
                title: "Text Message",
                description:
                  "Use your mobile phone to receive security codes via SMS.",
                icon: Phone,
              },
            ].map((method, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">{method.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm text-red-500">Off</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
                <Button variant="outline" className="w-full">
                  Set Up
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Login history
              </h3>
              <p className="text-sm text-muted-foreground">
                Your recent login activity
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground px-4">
              <span>LOGIN TYPE</span>
              <span>IP ADDRESS</span>
              <span>CLIENT</span>
            </div>
            {[
              {
                type: "Credential login",
                date: "08:14 AM 01/31/2024",
                ip: "95.130.17.84",
                client: "Chrome, Mac OS 10.15.7",
              },
              {
                type: "Credential login",
                date: "05:54 AM 01/31/2024",
                ip: "95.130.17.84",
                client: "Chrome, Mac OS 10.15.7",
              },
            ].map((login, index) => (
              <div
                key={index}
                className="grid grid-cols-3 p-4 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{login.type}</p>
                  <p className="text-sm text-muted-foreground">
                    on {login.date}
                  </p>
                </div>
                <span className="self-center">{login.ip}</span>
                <span className="self-center">{login.client}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "General":
        return renderGeneral();
      case "Team":
        return renderTeam();
      case "Security":
        return renderSecurity();
      case "Notifications":
        return renderNotifications();
      case "Devices":
        return renderDevices();
      default:
        return null;
    }
  };

  const handleUpdateProfile = async (
    field: keyof Pick<UserSettings, "fullName" | "email">,
    value: string
  ) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to update the user profile
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
      toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = async (
    field: keyof Pick<UserSettings, "passwordlessLogin" | "twoFactorAuth">
  ) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to update the setting
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setSettings((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
      toast.success(`${field} setting updated`);
    } catch (error) {
      toast.error(`Failed to update ${field}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotification = async (
    type: "email" | "phone",
    setting: string,
    value: boolean
  ) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to update notification settings
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [type]: {
            ...prev.notifications[type],
            [setting]: value,
          },
        },
      }));
      toast.success("Notification settings updated");
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to revoke the device
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setSettings((prev) => ({
        ...prev,
        devices: prev.devices.filter((device) => device.id !== deviceId),
      }));
      toast.success("Device access revoked");
    } catch (error) {
      toast.error("Failed to revoke device access");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteTeamMember = async (email: string) => {
    setIsLoading(true);
    try {
      // Here you would make an API call to send the invitation
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Here you would make an API call to delete the account
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      toast.success("Account deleted successfully");
      // Redirect to logout or home page
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
      </div>

      <div className="space-y-6">
        <nav className="border-b border-border">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "py-4 px-4 -mb-px text-sm font-medium flex items-center gap-2 transition-colors",
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div>{renderTab()}</div>
      </div>
    </div>
  );
};

export default SettingSystem;
