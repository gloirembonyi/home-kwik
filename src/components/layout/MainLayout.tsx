"use client";
// components/layouts/MainLayout.tsx
import React from 'react';
import { usePathname } from 'next/navigation';
import AuthenticatedLayout from './AuthenticatedLayout';
import useAuth from '@/hooks/useAuth';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
  }

  // For public routes, render without dashboard layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For authenticated routes, wrap with the dashboard layout
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

export default MainLayout;