"use client";

import SidebarShell from "@/components/layout/sidebar-shell";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    if (window) {
      const pathname = window.location.pathname;
      if (pathname === "/login") {
        setIsLoginPage(true);
      }
    }
  });
  [isAuthenticated, router];

  if (!isAuthenticated) {
    router.push("/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <SidebarShell>{children}</SidebarShell>;
};

export default App;
