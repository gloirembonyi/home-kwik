"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/base/card';
import { Button } from '@/components/ui/base/button';
import { Filter, Star, MapPin } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/base/alert-dialog';
import { Badge } from '@/components/ui/base/badge';


// Google Maps Script Loader Component
// Google Maps Script Loader Component
const useGoogleMaps = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Function to load the Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;

      // Unique identifier to prevent multiple loads
      script.id = 'google-maps-script';

      // Remove any existing script to prevent duplicates
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setLoadError('Failed to load Google Maps script');
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      };
    };

    const cleanup = loadGoogleMapsScript();

    return () => {
      cleanup?.();
    };
  }, [apiKey]);

  return { isLoaded, loadError };
};


type DriverStatus = 'available' | 'busy' | 'offline';
type VehicleType = 'old' | 'new';

interface Location {
  lat: number;
  lng: number;
}

interface Vehicle {
  model: string;
  plateNumber: string;
  type: 'old' | 'new';
}

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: Location
  rating: number;
  totalRides: number;
  vehicle: {
    model: string;
    plateNumber: string;
    type: 'old' | 'new';
  };
}


interface MapFilters {
  status: DriverStatus[];
  vehicleType: VehicleType[];
}

interface MapStats {
  totalDrivers: number;
  availableDrivers: number;
  busyDrivers: number;
  averageRating: number;
}

const LiveMap: React.FC = () => {
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    status: ['available', 'busy'],
    vehicleType: ['old', 'new']
  });
  const [showFilters, setShowFilters] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 40.7128, lng: -74.0060 });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<Map<string, google.maps.Marker>>(new Map());
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="text-destructive">
        Google Maps API key is missing. Please configure it in your environment.
      </div>
    );
  }

  // Memoized stats calculation
  const stats = useMemo(() => {
    const activeDrivers = drivers.filter(d => d.status !== 'offline');
    return {
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter(d => d.status === 'available').length,
      busyDrivers: drivers.filter(d => d.status === 'busy').length,
      averageRating: activeDrivers.length 
        ? Number((activeDrivers.reduce((acc, d) => acc + d.rating, 0) / activeDrivers.length).toFixed(1))
        : 0
    };
  }, [drivers]);

  // Filter drivers based on current filters
  const filteredDrivers = useMemo(() => 
    drivers.filter(driver => 
      filters.status.includes(driver.status) &&
      filters.vehicleType.includes(driver.vehicle.type)
    ),
    [drivers, filters]
  );

  const createMarkerIcon = useCallback((status: Driver['status'], selected: boolean = false) => ({
    path: window.google?.maps.SymbolPath.CIRCLE,
    scale: selected ? 10 : 8,
    fillColor: status === 'available' ? '#22c55e' : 
              status === 'busy' ? '#eab308' : '#6b7280',
    fillOpacity: 1,
    strokeWeight: selected ? 3 : 2,
    strokeColor: '#ffffff'
  }), []);

  const initializeMap = useCallback(async () => {
    if (!isLoaded || !mapContainerRef.current) {
      setMapError(isLoaded ? 'Map container not found' : 'Google Maps failed to load');
      return null;
    }

    try {
      const mapInstance = new window.google.maps.Map(
        mapContainerRef.current,
        {
          zoom: 13,
          center: mapCenter,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        }
      );

      // Initialize user location marker
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            if (!userMarker) {
              const marker = new window.google.maps.Marker({
                position: userLocation,
                map: mapInstance,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff'
                },
                title: 'Your Location'
              });
              setUserMarker(marker);
            } else {
              userMarker.setPosition(userLocation);
            }

            setMapCenter(userLocation);
            mapInstance.panTo(userLocation);
          },
          (error) => {
            console.warn('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
          }
        );
      }

      setMap(mapInstance);
      return mapInstance;
    } catch (error) {
      setMapError('Failed to initialize map. Please check your internet connection.');
      return null;
    }
  }, [mapCenter, userMarker]);

  const updateDriverMarkers = useCallback((mapInstance: google.maps.Map, currentDrivers: Driver[]) => {
    const newMarkers = new Map(markers);
    const bounds = new window.google.maps.LatLngBounds();
    
    // Update or create markers for current drivers
    currentDrivers.forEach(driver => {
      if (!filters.status.includes(driver.status) || 
          !filters.vehicleType.includes(driver.vehicle.type)) {
  
        if (newMarkers.has(driver.id)) {
          newMarkers.get(driver.id)?.setMap(null);
          newMarkers.delete(driver.id);
        }
        return;
      }

      const isSelected = selectedDriver?.id === driver.id;
      const position = new window.google.maps.LatLng(driver.location);
      
      if (newMarkers.has(driver.id)) {
        // Update marker
        const marker = newMarkers.get(driver.id)!;
        marker.setPosition(position);
        marker.setIcon(createMarkerIcon(driver.status, isSelected));
      } else {
        // Create new marker
        const marker = new window.google.maps.Marker({
          position,
          map: mapInstance,
          icon: createMarkerIcon(driver.status, isSelected),
          title: driver.name
        });

        marker.addListener('click', () => {
          setSelectedDriver(driver);
        });

        newMarkers.set(driver.id, marker);
      }

      bounds.extend(position);
    });

    // Remove markers for drivers no longer in the list
    markers.forEach((marker, driverId) => {
      if (!currentDrivers.find(d => d.id === driverId)) {
        marker.setMap(null);
        newMarkers.delete(driverId);
      }
    });

    setMarkers(newMarkers);

    // bounds if we have visible markers
    if (newMarkers.size > 0) {
      if (userMarker) {
        bounds.extend(userMarker.getPosition()!);
      }
      mapInstance.fitBounds(bounds);
    }
  }, [filters, markers, selectedDriver, createMarkerIcon, userMarker]);

   // the main useEffect
   useEffect(() => {
    const setup = async () => {
      
      if (isLoaded) {
        setLoading(true);
        const mapInstance = await initializeMap();
        
        if (mapInstance && drivers.length > 0) {
          updateDriverMarkers(mapInstance, drivers);
        }
        
        setLoading(false);
      }
    };

    setup();

    return () => {
      markers.forEach(marker => marker.setMap(null));
      userMarker?.setMap(null);
    };
  }, [isLoaded, initializeMap, updateDriverMarkers, drivers]);

  // Mock driver updates for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const generateMockDriver = (id: string): Driver => ({
        id,
        name: `Driver ${id}`,
        status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as Driver['status'],
        location: {
          lat: mapCenter.lat + (Math.random() - 0.5) * 0.1,
          lng: mapCenter.lng + (Math.random() - 0.5) * 0.1
        },
        vehicle: {
          model: ['Toyota Camry', 'Honda Accord', 'Tesla Model 3'][Math.floor(Math.random() * 3)],
          plateNumber: `ABC${id}`,
          type: Math.random() > 0.5 ? 'old' : 'new'
        },
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        totalRides: Math.floor(50 + Math.random() * 200)
      });

      const mockDrivers = Array.from({ length: 10 }, (_, i) => 
        generateMockDriver((i + 1).toString())
      );
      setDrivers(mockDrivers);

      const interval = setInterval(() => {
        setDrivers(prev => prev.map(driver => ({
          ...driver,
          location: {
            lat: driver.location.lat + (Math.random() - 0.5) * 0.002,
            lng: driver.location.lng + (Math.random() - 0.5) * 0.002
          },
          status: Math.random() > 0.9 
            ? ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as Driver['status']
            : driver.status
        })));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [mapCenter]);

  const handleFilterChange = (type: keyof MapFilters, value: DriverStatus | VehicleType) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (type === 'status') {
        const statusValue = value as DriverStatus;
        const statusArray = prev.status.includes(statusValue)
          ? prev.status.filter(s => s !== statusValue)
          : [...prev.status, statusValue];
        return { ...prev, status: statusArray };
      } else {
        const vehicleValue = value as VehicleType;
        const vehicleArray = prev.vehicleType.includes(vehicleValue)
          ? prev.vehicleType.filter(v => v !== vehicleValue)
          : [...prev.vehicleType, vehicleValue];
        return { ...prev, vehicleType: vehicleArray };
      }
    });
  };

  const getStatusColor = (status: DriverStatus): string => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Map</h2>
          <p className="text-sm text-muted-foreground">
            Tracking {filteredDrivers.length} drivers • {stats.availableDrivers} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Star className="h-4 w-4" />
            {stats.averageRating} avg rating
          </Badge>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            {(mapError || loadError) ? (
              <div className="h-[600px] w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-destructive flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {mapError || loadError}
                </p>
              </div>
            ) : !isLoaded ? (
              <div className="h-[600px] w-full bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            ) : (
              <div 
                ref={mapContainerRef}
                className="h-[600px] w-full rounded-lg"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-muted-foreground">Loading drivers...</p>
              ) : filteredDrivers.length === 0 ? (
                <p className="text-center text-muted-foreground">No drivers match the current filters</p>
              ) : (
                filteredDrivers.map(driver => (
                  <div
                    key={driver.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDriver?.id === driver.id
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'hover:bg-muted/50 border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedDriver(driver);
                      map?.panTo(driver.location);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(driver.status)}`} />
                        <span className="font-medium">{driver.name}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {driver.vehicle.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{driver.vehicle.model}</p>
                      <p>{driver.vehicle.plateNumber}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span>{driver.rating}</span>
                        <span className="text-xs">({driver.totalRides} rides)</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showFilters} onOpenChange={setShowFilters}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filter Drivers</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Driver Status</h4>
                  <div className="flex gap-2">
                    {(['available', 'busy', 'offline'] as DriverStatus[]).map(status => (
                      <Button
                        key={status}
                        variant={filters.status.includes(status) ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('status', status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Vehicle Type</h4>
                  <div className="flex gap-2">
                    {(['old', 'new'] as VehicleType[]).map(type => (
                      <Button
                        key={type}
                        variant={filters.vehicleType.includes(type) ? 'default' : 'outline'}
                        onClick={() => handleFilterChange('vehicleType', type)}
                        className="capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LiveMap;