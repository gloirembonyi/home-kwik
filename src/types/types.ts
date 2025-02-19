// types.ts
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface ActiveUsersResponse {
    count: number;
    timeline: Array<{
      date: string;
      count: number;
    }>;
  }
  
  export interface RegisteredUsersResponse {
    count: number;
  }
  
  export interface RidesResponse {
    total: number;
    timeline: Array<any>;
    completionRate: number;
    cancellationRate: number;
  }
  
  export interface DriverRatingsResponse {
    average: number;
    distribution: Array<any>;
  }
  
  export interface RideMetricsResponse {
    average: number;
  }
  
  export interface DriverUtilizationResponse {
    rate: number;
  }
  
  export interface RatioResponse {
    ratio: number;
  }
  
  export interface EarningsResponse {
    total: number;
    timeline: Array<{
      date: string;
      amount: number;
    }>;
  }
  
  export interface GrowthResponse {
    rate: number;
    timeline: Array<{
      date: string;
      rate: number;
    }>;
  }
  
  export interface PopularRoutesResponse {
    routes: Array<any>;
  }
  
  export interface PeakHoursResponse {
    hours: Array<any>;
  }
  
  export interface CustomerSatisfactionResponse {
    metrics: Array<any>;
  }

  // user Type

  export interface User {
    id: number;
    name: string;
    userId: string;
    phoneNumber: string;
    role: string;
    gender: string;
    status: "Active" | "Inactive" | "Pending";
    email: string;
    joinDate: string;
    department?: string;
    [key: string]: string | number | undefined;
  }
  
  export interface SortConfig {
    key: keyof User | null;
    direction: "ascending" | "descending";
  }
  
  export interface FilterConfig {
    role?: string;
    status?: string;
    gender?: string;
  }


  // types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardData {
  activeUsers: number;
  registeredUsers: number;
  totalRides: number;
  averageRating: number;
  rideStats: any[];   
  driverStats: any[];
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

export interface ActiveUsersResponse {
  active_users: number;
  hourly_activity: Array<{ hour: number; active: number }>;
}

export interface RegisteredUsersResponse {
  total_users: number;
  growth_history: Array<{ date: string; users: number; drivers: number }>;
}

export interface RidesResponse {
  total_rides: number;
  history: Array<any>;
  completion_rate: number;
}

export interface DriverRatingsResponse {
  average_rating: number;
  distribution: Array<any>;
}

export interface RideMetricsResponse {
  average_distance?: number;
  average_duration?: number;
}

export interface DriverUtilizationResponse {
  rate: number;
}

export interface RatioResponse {
  cancellation_rate: number;
  rider_to_driver_ratio: number;
}

export interface EarningsResponse {
  average_earnings: number;
  revenue_history: Array<{
    date: string;
    amount: number;
    type: string;
  }>;
}

export interface GrowthResponse {
  growth_rate: number;
}

export interface PopularRoutesResponse {
  average_distance: number;
  popular_routes: Array<any>;
}

export interface PeakHoursResponse {
  average_duration: number;
  peak_hours: string[];
}

export interface CustomerSatisfactionResponse {
  average_rating: number;
  satisfaction_metrics: Array<any>;
}

// API Response Types
export interface LoginResponse {
  token: string;
  user?: User;
}

export interface MFAResponse {
  token: string;
  user: User;
}

export interface AdminLoginResponse {
  token: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}