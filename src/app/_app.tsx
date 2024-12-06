"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import useAuth from "@/components/hooks/useAuth";



const App = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pathname = window.location.pathname;
    setIsLoginPage(pathname === "/login");
    const token=localStorage.getItem('token')
    console.log(token)
    if ( !isAuthenticated   ) {
      // Redirect unauthenticated users to login
      router.push("/login");
    } else {
      // Allow authenticated users or login page to load
      // router.push('/dashboard')
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null; // Show nothing while loading
  }

  // Render only the children for login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Render authenticated layout for other pages
  return <>{children}</>;
};

export default App;
