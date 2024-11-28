import React, { useEffect, useRef, useState } from "react";
import { 
  MapIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  MapPinIcon 
} from "@heroicons/react/24/solid";

// Enhanced Location Interface
interface MapLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  status: "active" | "completed" | "scheduled" | "delayed" | "emergency";
  driver?: {
    name: string;
    rating: number;
    vehicle: string;
  };
  passengers: number;
  route?: [number, number][];
  estimatedArrival?: string;
  distance?: number;
}

// Enhanced Map Props
interface MapProps {
  apiKey: string;
  onLocationSelect?: (location: MapLocation) => void;
}

// Advanced Marker Color and Icon Selection
const getMarkerDetails = (status: string) => {
  switch(status) {
    case 'active': return { 
      color: '#10B981', 
      icon: <MapIcon className="text-green-500 w-6 h-6" />,
      label: 'Active Ride'
    };
    case 'scheduled': return { 
      color: '#FBBF24', 
      icon: <ClockIcon className="text-yellow-500 w-6 h-6" />,
      label: 'Scheduled Ride'
    };
    case 'completed': return { 
      color: '#6B7280', 
      icon: <CheckCircleIcon className="text-gray-500 w-6 h-6" />,
      label: 'Completed Ride'
    };
    case 'delayed': return { 
      color: '#EF4444', 
      icon: <ExclamationTriangleIcon className="text-red-500 w-6 h-6" />,
      label: 'Delayed Ride'
    };
    case 'emergency': return { 
      color: '#DC2626', 
      icon: <ExclamationTriangleIcon className="text-red-800 w-6 h-6" />,
      label: 'Emergency Situation'
    };
    default: return { 
      color: '#6366F1', 
      icon: <MapPinIcon className="text-indigo-500 w-6 h-6" />, 
      label: 'Unknown Status'
    };
  }
};

// Advanced Google Maps Script Loading Hook
const useGoogleMapsScript = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError(new Error('Google Maps API key is required'));
      return;
    }

    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry,places,marker`;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError(new Error('Failed to load Google Maps script. Check your API key and network connection.'));
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return { isLoaded, error };
};

const Map: React.FC<MapProps> = ({ apiKey, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "DR-653CD3",
      name: "John Doe's Ride",
      coordinates: [-74.006, 40.7128],
      status: "active",
      driver: {
        name: "John Doe",
        rating: 4.8,
        vehicle: "Toyota Camry"
      },
      passengers: 2,
      route: [
        [-74.006, 40.7128],
        [-74.01, 40.72],
        [-74.02, 40.715]
      ],
      estimatedArrival: "8:45 AM",
      distance: 12.5
    },
    {
      id: "DR-653CD4",
      name: "Jane Smith's Ride",
      coordinates: [-74.01, 40.72],
      status: "scheduled",
      driver: {
        name: "Jane Smith",
        rating: 4.5,
        vehicle: "Honda Civic"
      },
      passengers: 1,
      estimatedArrival: "9:15 AM"
    },
    {
      id: "DR-653CD5",
      name: "Mike Johnson's Ride",
      coordinates: [-74.02, 40.715],
      status: "delayed",
      driver: {
        name: "Mike Johnson",
        rating: 4.2,
        vehicle: "Ford Focus"
      },
      passengers: 3,
      estimatedArrival: "Delayed"
    }
  ]);

  const { isLoaded, error } = useGoogleMapsScript(apiKey);

  useEffect(() => {
    if (error || !isLoaded || !mapContainer.current) {
      return;
    }

    // Create a unique map ID
    const mapId = 'ride-tracking-map';

    map.current = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 40.7128, lng: -74.006 },
      zoom: 11,
      mapTypeId: 'roadmap',
      mapId: mapId, // Add the mapId here
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'simplified' }]
        }
      ],
      mapTypeControl: true,
      zoomControl: true,
      fullscreenControl: true,
    });

    locations.forEach((location) => {
      const markerDetails = getMarkerDetails(location.status);
      
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position: {
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        },
        map: map.current!,
        title: location.name,
        content: (() => {
          const markerElement = document.createElement('div');
          markerElement.innerHTML = `
            <div class="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${markerDetails.color}" stroke="white" stroke-width="3" />
              </svg>
              <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                ${markerDetails.icon.props.className} <!-- Use className here -->
              </div>
            </div>
          `;
          return markerElement;
        })(),
      });

      // Draw route if available
      if (location.route && location.route.length > 1) {
        const routePath = new window.google.maps.Polyline({
          path: location.route.map(coord => ({
            lat: coord[1],
            lng: coord[0]
          })),
          geodesic: true,
          strokeColor: markerDetails.color,
          strokeOpacity: 0.7,
          strokeWeight: 4
        });
        routePath.setMap(map.current);
      }

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-xs">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-lg">${location.id}</h3>
              <span class="text-sm text-gray-500 capitalize">${markerDetails.label}</span>
            </div>
            <div class="space-y-2">
              ${location.driver ? `
                <div>
                  <p class="font-semibold">${location.driver.name}</p>
                  <p class="text-sm text-gray-600">${location.driver.vehicle}</p>
                  <div class="flex items-center text-sm">
                    ⭐ ${location.driver.rating}/5
                  </div>
                </div>
              ` : ''}
              <div class="flex justify-between">
                <span>Passengers:</span>
                <span class="font-semibold">${location.passengers}</span>
              </div>
              ${location.estimatedArrival ? `
                <div class="flex justify-between">
                  <span>Estimated Arrival:</span>
                  <span class="font-semibold">${location.estimatedArrival}</span>
                </div>
              ` : ''}
              ${location.distance ? `
                <div class="flex justify-between">
                  <span>Distance:</span>
                  <span class="font-semibold">${location.distance} km</span>
                </div>
              ` : ''}
            </div>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open({
          map: map.current!,
          anchor: marker,
        });
        setSelectedLocation(location);
        onLocationSelect?.(location);
      });
    });
  }, [locations, isLoaded, error, onLocationSelect]);

  // Render loading or error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error loading map: {error.message}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        <span className="ml-4">Loading advanced map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Enhanced Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <h4 className="text-sm font-bold mb-3 flex items-center">
          <MapIcon className="h-5 w-5 mr-2 text-blue-500" />
          Ride Status Legend
        </h4>
        <div className="space-y-2">
          {['active', 'scheduled', 'completed', 'delayed', 'emergency'].map((status) => {
            const details = getMarkerDetails(status);
            return (
              <div key={status} className="flex items-center space-x-2">
                {details.icon}
                <span className="text-xs capitalize">{details.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-10 bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-72">
          <h3 className="font-bold text-lg mb-2">Selected Ride Details</h3>
          <div className="space-y-2">
            <p><strong>ID:</strong> {selectedLocation.id}</p>
            <p><strong>Status:</strong> {selectedLocation.status}</p>
            {selectedLocation.driver && (
              <>
                <p><strong>Driver:</strong> {selectedLocation.driver.name}</p>
                <p><strong>Vehicle:</strong> {selectedLocation.driver.vehicle}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;