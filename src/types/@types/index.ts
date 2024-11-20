
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
interface ActionHistoryRecord {
  action: string;
  timestamp: string;
}

// Action handlers interface
interface ActionHandlers {
  onEdit: (row: IUserToDelete) => void;
  onShare: (row: IUserToDelete) => void;
  onArchive: (row: IUserToDelete) => void;
  onExport: (row: IUserToDelete) => void;
  onFlag: (row: IUserToDelete) => void;
}

// Type definitions for API responses
interface ApiResponse<T> {
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

interface ActiveUsersResponse {
  count: number;
  timeline: Array<{ date: string; count: number }>;
}

interface RegisteredUsersResponse {
  count: number;
  growth: number;
}

interface RidesResponse {
  total: number;
  timeline: Array<{
    date: string;
    rides: number;
    revenue: number;
  }>;
  completionRate: number;
  cancellationRate: number;
}

interface DriverRatingsResponse {
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

interface DriverUtilizationResponse {
  rate: number;
  timeline: Array<{
    date: string;
    rate: number;
  }>;
}

interface RatioResponse {
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

interface GrowthResponse {
  rate: number;
  timeline: Array<{
    date: string;
    rate: number;
  }>;
}

interface PopularRoutesResponse {
  routes: Array<{
    route: string;
    count: number;
    revenue: number;
  }>;
}

interface PeakHoursResponse {
  hours: Array<{
    hour: number;
    rides: number;
  }>;
}

interface CustomerSatisfactionResponse {
  metrics: Array<{
    category: string;
    score: number;
  }>;
}

// Define TypeScript interfaces
interface RatingData {
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

interface ChartProps {
  data?: RatingData[];
  loading?: boolean;
  error?: string | null;
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
}

interface DashboardGridProps {
  metrics?: {
    driverStats?: RatingData[];
  };
  loading?: boolean;
}