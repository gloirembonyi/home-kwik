// types/map.ts

export interface Driver {
    location: any;
    id: string;
    name: string;
    lat: number;
    lng: number;
    status: 'available' | 'busy' | 'offline';
    currentRide?: {
      pickupLocation: [number, number];
      dropoffLocation: [number, number];
      progress: number;
    };
    rating: number;
    totalRides: number;
    vehicle: {
      model: string;
      plateNumber: string;
      type: 'standard' | 'premium';
    };
    phone?: string;
  }
  
  export interface MapState {
    center: [number, number];
    zoom: number;
    selectedDriver: Driver | null;
    drivers: Driver[];
    filters: {
      status: ('available' | 'busy' | 'offline')[];
      vehicleType: ('standard' | 'premium')[];
    };
  }
  
  export interface MapStats {
    totalDrivers: number;
    activeDrivers: number;
    busyDrivers: number;
    availableDrivers: number;
    averageRating: number;
  }


  export interface DriverStatus {
    center: [number, number];
    zoom: number;
    selectedDriver: Driver | null;
    drivers: Driver[];
    filters: {
      status: ('available' | 'busy' | 'offline')[];
      vehicleType: ('standard' | 'premium')[];
    };
  }


// Enhanced TypeScript Interfaces
export interface Ride {
  id: string;
  userId: string;
  driverId: string;
  driver?: Driver;
  status: "active" | "completed" | "scheduled" | "delayed" | "emergency";
  pickupLocation: {
    address: string;
    coordinates: [number, number];
  };
  dropoffLocation: {
    address: string;
    coordinates: [number, number];
  };
  passengers: number;
  estimatedArrival?: string;
  actualArrivalTime?: string;
  route?: [number, number][];
  distance?: number;
  emergencyDetails?: {
    type: string;
    description: string;
    reportedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

