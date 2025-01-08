// types/api.ts
export interface Driver {
    id: string;
    name: string;
    rating: number;
    totalRides: number;
    status: 'available' | 'busy' | 'offline';
    currentLocation?: {
      lat: number;
      lng: number;
    };
  }
  
  export interface Ride {
    id: string;
    userId: string;
    driverId: string;
    pickup: {
      lat: number;
      lng: number;
      address: string;
    };
    destination: {
      lat: number;
      lng: number;
      address: string;
    };
    status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    fare: number;
    timestamp: string;
  }
  
  export interface DashboardStats {
    totalRides: number;
    activeDrivers: number;
    completionRate: number;
    avgFare: number;
    revenueToday: number;
  }
  
  export interface DashboardError {
    type: 'stats' | 'rides' | 'drivers';
    message: string;
  }
  
  
  // api/rideshare.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

export const fetchActiveRides = async (): Promise<Ride[]> => {
  const response = await fetch(`${API_BASE_URL}/rides/active`);
  if (!response.ok) throw new Error('Failed to fetch active rides');
  return response.json();
};

export const fetchDrivers = async (): Promise<Driver[]> => {
  const response = await fetch(`${API_BASE_URL}/drivers`);
  if (!response.ok) throw new Error('Failed to fetch drivers');
  return response.json();
};