
export interface IUserToDelete {
  id: string;
  names: string;
  usertype: "rider" | "driver";
  email: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  rating: number;
  totalRides: number;
  joinDate: string;
  phoneNumber: string;
  completedRides: number;
  cancelledRides: number;
  totalSpent: number;
  preferredPayment: "credit_card" | "cash" | "mobile_money";
  verificationStatus: "verified" | "pending" | "unverified";
  profileImage?: string;
  location?: {
    city: string;
    country: string;
  };

  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

};

export interface IUserData {
  id: number;
  name: string;
  email: string;
  usertype: string;
  stats: any;

}

// Interface for action history
export interface ActionHistoryRecord {
  action: string;
  timestamp: string;
}

// Action handlers interface
export interface ActionHandlers {
  onEdit: (row: IUserToDelete) => void;
  onShare: (row: IUserToDelete) => void;
  onArchive: (row: IUserToDelete) => void;
  onExport: (row: IUserToDelete) => void;
  onFlag: (row: IUserToDelete) => void;
}

// Type definitions for API responses
export interface ApiResponse<T> {
  count: number;
  total: number;
  average: number;
  timeline: any;
  distribution: any;
  rate: number;
  ratio: any;
  completionRate: any;
  cancellationRate: any;



  
  routes: any;
  hours: string;
  metrics: any;
  success: boolean;
  data: T;
  message?: string;
}

export interface ActiveUsersResponse {
  count: number;
  timeline: Array<{ date: string; count: number }>;
}

export interface RegisteredUsersResponse {
  count: number;
  growth: number;
}

export interface RidesResponse {
  total: number;
  timeline: Array<{
    date: string;
    rides: number;
    revenue: number;
  }>;
  completionRate: number;
  cancellationRate: number;
}

export interface DriverRatingsResponse {
  average: number;
  distribution: Array<{
    rating: number;
    count: number;
  }>;
}

interface RideMetricsResponse {
  average: number;
  timeline: Array<{
    date: string;
    value: number;
  }>;
}

export interface DriverUtilizationResponse {
  rate: number;
  timeline: Array<{
    date: string;
    rate: number;
  }>;
}

export interface RatioResponse {
  ratio: number;
  trend: Array<{
    date: string;
    ratio: number;
  }>;
}

interface EarningsResponse {
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
  routes: Array<{
    route: string;
    count: number;
    revenue: number;
  }>;
}

export interface PeakHoursResponse {
  hours: Array<{
    hour: number;
    rides: number;
  }>;
}

export interface CustomerSatisfactionResponse {
  metrics: Array<{
    category: string;
    score: number;
  }>;
}

// Define TypeScript interfaces
export interface RatingData {
  rating: string;
  frequency: number;
  percentageChange: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RatingData & { total: number };
  }>;
  label?: string;
}

export interface ChartProps {
  data?: RatingData[];
  loading?: boolean;
  error?: string | null;
}

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
}

export interface DashboardGridProps {
  metrics?: {
    driverStats?: RatingData[];
  };
  loading?: boolean;
}