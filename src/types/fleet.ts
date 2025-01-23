export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface RideInfo {
  id: string;
  status: "pending" | "ongoing" | "completed";
  timeline: {
    status: string;
    time: string;
    location: string;
    coordinates: LatLngLiteral;
  }[];
  pickupLocation: {
    address: string;
    coordinates: LatLngLiteral;
  };
  dropoffLocation: {
    address: string;
    coordinates: LatLngLiteral;
  };
  passengerName: string;
  passengerPhone: string;
  startTime?: string;
  endTime?: string;
  distance?: string;
  duration?: string;
}

export interface Vehicle {
  id: string;
  driverName: string;
  driverPhone: string;
  licensePlate: string;
  location: string;
  coordinates: LatLngLiteral;
  status: "available" | "on_trip" | "offline";
  currentRide?: RideInfo;
  lastUpdated?: string;
  heading?: number;
} 