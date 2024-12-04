
export interface DashboardMetrics {
  activeUsers: number;
  registeredUsers: number;
  totalRides: number;
  averageRating: number;
  rideStats: any[];
  driverStats: any[];
  userActivities: any[];
  revenueData: any[];
  completionRate: number;
  cancellationRate: number;
  riderToDriverRatio: number;
  averageRideDistance: number;
  averageRideDuration: number;
  driverUtilization: number;
  driverEarnings: number;
  growthRate: number;
  peakHours: PeakHourData[];
  popularRoutes: any[];
  userGrowth: any[];
  customerSatisfaction: Array<{ score: number }>;
}

export interface RideStat {
  date: string;
  rides: number;
  revenue: number;
}

export interface DriverStat {
  rating: number;
  count: number;
}

export interface UserActivity {
  hour: number;
  active: number;
}

export interface RevenueStat {
  date: string;
  amount: number;
  type: string;
}

export interface PeakHourStat {
  hour: string;
  rides: number;
}

interface PeakHour {
  hour: string | number;
  rides: number;
}

export interface RouteStat {
  route: string;
  count: number;
  revenue: number;
}

export interface GrowthStat {
  date: string;
  users: number;
  drivers: number;
}

export interface SatisfactionStat {
  category: string;
  score: number;
}

export interface UserActivityChartProps {
  data: UserActivity[];
}

export interface RideChartProps {
  data: RideStat[];
}

export interface DriverPerformanceChartProps {
  data: DriverStat[];
}



// dashboard

export interface PopularRoute {
  route: string;
  count: number;
  change: number; // Percentage change from previous period
  startPoint: string;
  endPoint: string;
}

export interface PeakHourData {
  hour: number;
  rides: number;
  avgWaitTime: number;
  utilization: number;
}

export interface SatisfactionMetric {
  category: string;
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  details: {
    label: string;
    value: number;
  }[];
}

