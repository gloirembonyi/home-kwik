export interface UserSettings {
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