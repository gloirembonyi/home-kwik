"use client";
// components/layouts/AuthenticatedLayout.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar/page';
import DashboardHeader from '../dashboard/DashboardHeader/Header';


type TimeRange = 'day' | 'week' | 'month' | 'year';

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const refreshData = () => {
    // Implement your refresh logic here
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          refreshData={refreshData}
        />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;