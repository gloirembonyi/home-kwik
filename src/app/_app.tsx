"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { useAuth } from "@/components/hooks/useAuth";

const App = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setIsLoginPage(path.includes("/auth/login"));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && !isLoginPage) {
    router.push("/auth/login");
    return null;
  }

  // Render only the children for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Render authenticated layout for other pages
  return <>{children}</>;
};

export default App;
