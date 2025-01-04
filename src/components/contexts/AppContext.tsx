'use client'
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { AnalyticsApiService } from '@/services/analyticsService';

export interface DashboardData {
  activeUsers: number;
  registeredUsers: number;
  totalRides: number;
  averageRating: number;
  rideStats: any[];   
  driverStats: any[] 
  userActivities: Array<{ hour: number; active: number }>;
  revenueData: Array<{ date: string; amount: number; type: string }>;
  completionRate: number;
  cancellationRate: number;
  riderToDriverRatio: number;
  averageRideDistance: number;
  averageRideDuration: number;
  driverUtilization: number;
  driverEarnings: number;
  growthRate: number;
  peakHours: string[];
  popularRoutes: any[]; 
  userGrowth: Array<{ date: string; users: number; drivers: number }>;
  customerSatisfaction: any[]; 
}

export interface AnalyticsContextType {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  fetchDashboardData: (timeRange: string) => Promise<void>;
  exportData: (format: 'csv' | 'pdf', timeRange: string) => Promise<Blob>;
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const apiService = useMemo(() => AnalyticsApiService.getInstance(), []);

  const fetchDashboardData = useCallback(async (timeRange: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchDashboardData(timeRange);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [apiService]);

  const exportData = useCallback(async (format: 'csv' | 'pdf', timeRange: string) => {
    try {
      return await apiService.exportData(format, timeRange);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Export failed'));
      throw err;
    }
  }, [apiService]);

  const contextValue = useMemo(() => ({
    dashboardData,
    isLoading,
    error,
    fetchDashboardData,
    exportData
  }), [dashboardData, isLoading, error, fetchDashboardData, exportData]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
