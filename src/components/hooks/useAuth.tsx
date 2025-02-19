"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import tokenManager from "@/utils/tokenManager";
import { getErrorMessage } from "../lib/utils";
import { refreshToken } from "@/utils/api";

export interface User {
  userId: number;
  roleId: number;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  profilePicture: string | null;
  currentRole: {
    roleId: number;
    name: string;
    description: string;
  };
  chatUid?: string;
  verificationStatus?: string;
  isEmailVerified?: boolean;
  refreshToken?: string | null;
  loginCodeMFA?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => void;
  login: (
    token: string,
    userData?: User,
    rememberMe?: boolean
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  isAdmin: false,
  logout: () => {},
  login: async () => {},
});

// export const nonProtectedRoutes = [
//   "/auth/login",
//   "/auth/forgot-password",
//   "/auth/reset-password",
// ];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");
      const token = tokenManager.getToken();
      const storedUser = tokenManager.getUser();
      console.log("Token exists:", !!token);
      console.log("User exists:", !!storedUser);

      if (token && storedUser) {
        // Check if token needs refresh
        try {
          const refreshTokenValue = storedUser.refreshToken;
          if (refreshTokenValue) {
            const response = await refreshToken(refreshTokenValue);
            if (response.success) {
              tokenManager.setToken(response.data.token, true);
            }
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }

        setIsAuthenticated(true);
        setUser(storedUser);
        setIsAdmin(storedUser?.currentRole?.name === "ADMIN");
        console.log("Auth check: User is authenticated");
        console.log("Is admin:", storedUser?.currentRole?.name === "ADMIN");
      } else {
        console.log("Auth check: Missing token or user data");
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        tokenManager.clearTokens();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    token: string,
    userData?: User,
    rememberMe: boolean = false
  ) => {
    try {
      console.log("Login started...", { token, userData });

      // Store token and user data
      tokenManager.setToken(token, rememberMe);

      if (userData) {
        tokenManager.setUser(userData, rememberMe);
        console.log("User data stored:", userData);

        // Update state
        setUser(userData);
        setIsAdmin(userData?.currentRole?.name === "ADMIN");
      }

      // Update authentication state
      setIsAuthenticated(true);
      console.log("Auth state updated");

      // Show success message
      toast.success("Login successful!");

      // Wait for state updates to complete before navigation
      setTimeout(() => {
        router.push("/dashboard");
      }, 0);
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
      toast.error("Login failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out...");
    tokenManager.clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        isAdmin,
        logout,
        login,
      }}
    >
      <RecoilRoot>{children}</RecoilRoot>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
