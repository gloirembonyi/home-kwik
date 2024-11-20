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


  