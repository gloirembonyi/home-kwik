"use client";

import React, { createContext, useContext, useState } from "react";
import { UserSettings } from "@/types/settings";
import { toast } from "react-hot-toast";

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  handleUpdateProfile: (
    field: keyof UserSettings,
    value: string
  ) => Promise<void>;
  handleUpdateNotifications: (
    type: string,
    field: string,
    value: boolean
  ) => Promise<void>;
  handleUpdateSecurity: (field: string, value: boolean) => Promise<void>;
}

const defaultSettings: UserSettings = {
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
  devices: [],
  team: [],
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (
    field: keyof UserSettings,
    value: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSettings((prev) => ({ ...prev, [field]: value }));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotifications = async (
    type: string,
    field: string,
    value: boolean
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [type]: {
            ...prev.notifications[type as keyof typeof prev.notifications],
            [field]: value,
          },
        },
      }));
      toast.success("Notifications updated successfully");
    } catch (error) {
      toast.error("Failed to update notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSecurity = async (field: string, value: boolean) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSettings((prev) => ({ ...prev, [field]: value }));
      toast.success("Security settings updated successfully");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        handleUpdateProfile,
        handleUpdateNotifications,
        handleUpdateSecurity,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
