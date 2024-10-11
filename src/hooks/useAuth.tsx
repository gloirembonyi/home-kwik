"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorMessage } from "@/lib/utils";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { login } from "./useApi";
import { RecoilRoot } from "recoil";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  national_id: string;
  phonenumber: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean | null;
}
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const nonProtectedRoutes = [
//   "/auth/login",
//   "/auth/forgot-password",
//   "/auth/reset-password",
// ];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);

  const authenticateUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: response } = await login(email, password);
      console.log(process.env.DEV && response);
      Cookies.set("token", response.data.access);
      localStorage.setItem("kabstore_user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success("Login successful");
      window.location.href = "/";
    } catch (error: any) {
      console.log(process.env.DEV && error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("kabstore_user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    const user = localStorage.getItem("kabstore_user");
    if (user) {
      try {
        setUser(JSON.parse(user));
      } catch (error) {
        console.log(process.env.DEV && error);
      }
    }
    const token = Cookies.get("token");
    setIsAuthenticated(Boolean(token));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: authenticateUser,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      <RecoilRoot>{children}</RecoilRoot>
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
