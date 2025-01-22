import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  Circle,
  HeatmapLayer,
  Polygon,
} from "@react-google-maps/api";
import { Card } from "@/components/ui/base/card";
import {
  Car,
  Search,
  Bell,
  AlertTriangle,
  Battery,
  MapPin,
  Grip,
  Layers,
  Map as MapIcon,
  ChevronDown,
  Activity,
  Car as TrafficIcon,
  Pencil,
  ZoomIn,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/base/alert";
import Draggable from "react-draggable";

// Enhanced Types
interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface RideInfo {
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

interface Vehicle {
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

// Mock data with enhanced information
const initialVehicles: Vehicle[] = [
  {
    id: "KR-001",
    driverName: "John Doe",
    driverPhone: "+250789123456",
    licensePlate: "RAE 456 D",
    location: "Kigali City Center",
    coordinates: { lat: -1.9441, lng: 30.0619 },
    status: "on_trip",
    currentRide: {
      id: "RIDE-001",
      status: "ongoing",
      pickupLocation: {
        address: "Kigali Heights, Kimihurura",
        coordinates: { lat: -1.9506, lng: 30.0646 },
      },
      dropoffLocation: {
        address: "Kigali International Airport",
        coordinates: { lat: -1.9674, lng: 30.0673 },
      },
      passengerName: "Alice Smith",
      passengerPhone: "+250789123457",
      startTime: new Date().toISOString(),
      timeline: [
        {
          status: "Pickup",
          time: new Date().toISOString(),
          location: "Kigali Heights",
          coordinates: { lat: -1.9506, lng: 30.0646 },
        },
        {
          status: "En Route",
          time: new Date().toISOString(),
          location: "KG 9 Ave",
          coordinates: { lat: -1.9557, lng: 30.0661 },
        },
      ],
    },
  },
  {
    id: "KR-002",
    driverName: "Sarah Johnson",
    driverPhone: "+250789123458",
    licensePlate: "RAE 789 E",
    location: "Nyamirambo, Kigali",
    coordinates: { lat: -1.9824, lng: 30.0488 },
    status: "available",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "KR-003",
    driverName: "Michael Brown",
    driverPhone: "+250789123459",
    licensePlate: "RAE 123 F",
    location: "Remera, Kigali",
    coordinates: { lat: -1.9557, lng: 30.1123 },
    status: "offline",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "KR-004",
    driverName: "Emma Wilson",
    driverPhone: "+250789123460",
    licensePlate: "RAE 234 G",
    location: "Kimironko, Kigali",
    coordinates: { lat: -1.9443, lng: 30.1141 },
    status: "on_trip",
    currentRide: {
      id: "RIDE-002",
      status: "ongoing",
      pickupLocation: {
        address: "Kimironko Market",
        coordinates: { lat: -1.9443, lng: 30.1141 },
      },
      dropoffLocation: {
        address: "Kigali Convention Center",
        coordinates: { lat: -1.9506, lng: 30.0646 },
      },
      passengerName: "Bob Johnson",
      passengerPhone: "+250789123461",
      startTime: new Date().toISOString(),
      timeline: [
        {
          status: "Pickup",
          time: new Date().toISOString(),
          location: "Kimironko Market",
          coordinates: { lat: -1.9443, lng: 30.1141 },
        },
        {
          status: "En Route",
          time: new Date().toISOString(),
          location: "KG 11 Ave",
          coordinates: { lat: -1.9506, lng: 30.1012 },
        },
      ],
    },
  },
  {
    id: "KR-005",
    driverName: "David Lee",
    driverPhone: "+250789123462",
    licensePlate: "RAE 567 H",
    location: "Gisozi, Kigali",
    coordinates: { lat: -1.9333, lng: 30.0833 },
    status: "offline",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "KR-006",
    driverName: "Jean Pierre",
    driverPhone: "+250789123463",
    licensePlate: "RAE 890 J",
    location: "Kibagabaga, Kigali",
    coordinates: { lat: -1.9397, lng: 30.1175 },
    status: "on_trip",
    lastUpdated: new Date().toISOString(),
    currentRide: {
      id: "RIDE-003",
      status: "ongoing",
      pickupLocation: {
        address: "Kibagabaga Hospital",
        coordinates: { lat: -1.9397, lng: 30.1175 },
      },
      dropoffLocation: {
        address: "Kigali City Center",
        coordinates: { lat: -1.9441, lng: 30.0619 },
      },
      passengerName: "Marie Claire",
      passengerPhone: "+250789123464",
      startTime: new Date().toISOString(),
      timeline: [
        {
          status: "Pickup",
          time: new Date().toISOString(),
          location: "Kibagabaga Hospital",
          coordinates: { lat: -1.9397, lng: 30.1175 },
        },
        {
          status: "En Route",
          time: new Date().toISOString(),
          location: "KG 13 Ave",
          coordinates: { lat: -1.9441, lng: 30.0619 },
        },
      ],
    },
  },
  {
    id: "DR-890PQ9",
    location: "Kacyiru, Kigali",
    coordinates: { lat: -1.9506, lng: 30.0646 },
    status: "available",
    driverName: "Patrick Mugisha",
    driverPhone: "+250789123465",
    licensePlate: "RAE 123 K",
    lastUpdated: new Date().toISOString(),
  },
];

const FleetPage = () => {
  const [mockVehicles, setMockVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(
    initialVehicles[0]
  );
  const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 });
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [selectedRoute, setSelectedRoute] =
    useState<google.maps.DirectionsResult | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicles, setFilteredVehicles] =
    useState<Vehicle[]>(initialVehicles);
  const [replayMode, setReplayMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [mapType, setMapType] = useState("roadmap");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showTrafficLayer, setShowTrafficLayer] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [geofences, setGeofences] = useState<google.maps.Polygon[]>([]);
  const [trafficLayer, setTrafficLayer] =
    useState<google.maps.TrafficLayer | null>(null);
  const [isMapControlsCollapsed, setIsMapControlsCollapsed] = useState(false);
  const mapControlsRef = useRef(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const animationFrameRef = useRef<number>();

  const mapStyles = {
    height: "100%",
    width: "100%",
  };

  // Enhanced vehicle selection with map interaction
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setMapCenter(vehicle.coordinates);
    setShowInfoWindow(true);

    // Smooth zoom to vehicle
    if (mapRef.current) {
      mapRef.current.panTo(vehicle.coordinates);
      mapRef.current.setZoom(15);
    }
  };

  // Enhanced marker icon with status indication
  const getMarkerIcon = useCallback(
    (vehicle: Vehicle) => {
      if (!googleLoaded) return undefined;

      const statusColors = {
        available: "#4CAF50",
        on_trip: "#2196F3",
        offline: "#9E9E9E",
      };

      return {
        url: "/car-icon.png",
        scaledSize: new google.maps.Size(32, 32),
        rotation: vehicle.heading || 0,
        fillColor: statusColors[vehicle.status],
        fillOpacity: 1,
      } as google.maps.Icon;
    },
    [googleLoaded]
  );

  // Enhanced route calculation with waypoints
  const calculateRoute = useCallback(
    async (vehicle: Vehicle) => {
      if (
        !vehicle.currentRide?.timeline ||
        vehicle.currentRide.timeline.length < 2
      )
        return;

      const directionsService = new google.maps.DirectionsService();
      const timeline = vehicle.currentRide.timeline;
      const origin = timeline[0].coordinates;
      const destination = timeline[timeline.length - 1].coordinates;
      const waypoints = timeline.slice(1, -1).map((point) => ({
        location: point.coordinates,
        stopover: true,
      }));

      if (!origin || !destination) return;

      try {
        const result = await directionsService.route({
          origin,
          destination,
          waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirections(result);
        if (vehicle.id === selectedVehicle.id) {
          setSelectedRoute(result);
        }
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    },
    [selectedVehicle]
  );

  // Search and filter functionality
  useEffect(() => {
    const filtered = mockVehicles.filter(
      (vehicle) =>
        vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchQuery, mockVehicles]);

  // Enhanced vehicle movement simulation
  useEffect(() => {
    const updateVehiclePositions = () => {
      setMockVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (
            vehicle.status === "on_trip" &&
            vehicle.currentRide?.timeline &&
            googleLoaded
          ) {
            const timeline = vehicle.currentRide.timeline;
            const speed = playbackSpeed * (replayMode ? 5 : 1);
            const progress = (Date.now() % (60000 / speed)) / (60000 / speed);

            const index = Math.floor(progress * (timeline.length - 1));
            const currentPoint = timeline[index].coordinates;
            const nextPoint =
              timeline[Math.min(index + 1, timeline.length - 1)].coordinates;

            const lat =
              currentPoint.lat +
              (nextPoint.lat - currentPoint.lat) * (progress % 1);
            const lng =
              currentPoint.lng +
              (nextPoint.lng - currentPoint.lng) * (progress % 1);

            return {
              ...vehicle,
              coordinates: { lat, lng },
              lastUpdated: new Date().toISOString(),
              heading: googleLoaded
                ? google.maps.geometry.spherical.computeHeading(
                    new google.maps.LatLng(currentPoint.lat, currentPoint.lng),
                    new google.maps.LatLng(nextPoint.lat, nextPoint.lng)
                  )
                : 0,
            };
          }
          return vehicle;
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateVehiclePositions);
    };

    if (googleLoaded) {
      animationFrameRef.current = requestAnimationFrame(updateVehiclePositions);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [replayMode, playbackSpeed, googleLoaded]);

  const getHeatmapData = () => {
    return mockVehicles.map((vehicle) => ({
      location: new google.maps.LatLng(
        vehicle.coordinates.lat,
        vehicle.coordinates.lng
      ),
      weight: vehicle.status === "on_trip" ? 3 : 1,
    }));
  };

  // Add this effect to handle traffic layer
  useEffect(() => {
    if (trafficLayer) {
      trafficLayer.setMap(showTrafficLayer ? mapInstance : null);
    }
  }, [showTrafficLayer, trafficLayer, mapInstance]);

  // Update the InfoWindow content
  const renderInfoWindow = (vehicle: Vehicle) => (
    <div className="p-2 bg-card text-foreground">
      <h3 className="font-bold mb-1">{vehicle.id}</h3>
      <p className="text-sm">Driver: {vehicle.driverName}</p>
      <p className="text-sm">Status: {vehicle.status}</p>
      {vehicle.currentRide && (
        <>
          <p className="text-sm mt-2 font-medium">Current Ride</p>
          <p className="text-sm">
            From: {vehicle.currentRide.pickupLocation.address}
          </p>
          <p className="text-sm">
            To: {vehicle.currentRide.dropoffLocation.address}
          </p>
          <p className="text-sm">
            Passenger: {vehicle.currentRide.passengerName}
          </p>
        </>
      )}
    </div>
  );

  // Update the vehicle card in the list
  const renderVehicleCard = (vehicle: Vehicle) => (
    <Card
      key={vehicle.id}
      className={`p-4 cursor-pointer transition-colors border border-border ${
        selectedVehicle.id === vehicle.id
          ? "bg-accent"
          : "bg-card hover:bg-accent/50"
      }`}
      onClick={() => handleVehicleSelect(vehicle)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Car className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-foreground">{vehicle.id}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.driverName}</p>
          <p className="text-xs text-muted-foreground">{vehicle.location}</p>
        </div>
        <div className="flex flex-col items-end">
          <div
            className={`w-2 h-2 rounded-full ${
              vehicle.status === "on_trip"
                ? "bg-blue-500"
                : vehicle.status === "available"
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          />
          {vehicle.currentRide && (
            <span className="text-xs text-muted-foreground mt-1">On Trip</span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-12 gap-6 h-screen bg-background">
      {/* Left Panel */}
      <div className="col-span-3 bg-card border-r border-border pr-4 overflow-y-auto">
        <div className="sticky top-0 bg-card z-10 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Fleet</h2>
            {/* Playback Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setReplayMode(!replayMode)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                {replayMode ? "Live Mode" : "Replay Mode"}
              </button>
              {replayMode && (
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="px-2 py-1 border border-border rounded-md bg-background"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Active Vehicle Details */}
        {selectedVehicle && (
          <Card className="p-6 bg-card border border-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">
                  {selectedVehicle.id}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVehicle.driverName || selectedVehicle.location}
                </p>
              </div>
            </div>

            {/* Vehicle Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {selectedVehicle.location}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {new Date(
                    selectedVehicle.lastUpdated || ""
                  ).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Current Ride Details */}
            {selectedVehicle.currentRide && (
              <>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Current Ride</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Passenger</p>
                      <p>{selectedVehicle.currentRide.passengerName}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {selectedVehicle.currentRide.timeline.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 mb-4 relative"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                        {index <
                          selectedVehicle.currentRide!.timeline.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-1" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {event.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}

        {/* Vehicle List */}
        <div className="space-y-3">
          {filteredVehicles.map((vehicle) => renderVehicleCard(vehicle))}
        </div>
      </div>

      {/* Map Panel */}
      <div className="col-span-9 h-full relative">
        {/* Draggable Map Controls */}
        <Draggable
          handle=".drag-handle"
          bounds="parent"
          nodeRef={mapControlsRef}
        >
          <div
            ref={mapControlsRef}
            className="absolute top-4 right-4 z-10 w-48"
          >
            <div className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 rounded-lg shadow-lg border border-border">
              {/* Header with drag handle */}
              <div className="drag-handle flex items-center justify-between p-2 cursor-move border-b border-border">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Map Controls</span>
                </div>
                <button
                  onClick={() =>
                    setIsMapControlsCollapsed(!isMapControlsCollapsed)
                  }
                  className="p-1 hover:bg-accent rounded-md"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isMapControlsCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible content */}
              {!isMapControlsCollapsed && (
                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                    <MapIcon className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={mapType}
                      onChange={(e) => setMapType(e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm focus:outline-none"
                    >
                      <option value="roadmap">Road Map</option>
                      <option value="satellite">Satellite</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="terrain">Terrain</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={`p-2 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
                        showHeatmap
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      <Activity className="w-3 h-3" />
                      Heatmap
                    </button>

                    <button
                      onClick={() => setShowTrafficLayer(!showTrafficLayer)}
                      className={`p-2 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
                        showTrafficLayer
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      <TrafficIcon className="w-3 h-3" />
                      Traffic
                    </button>

                    <button
                      onClick={() => setDrawingMode(!drawingMode)}
                      className={`p-2 text-xs rounded-md flex items-center gap-1.5 transition-colors ${
                        drawingMode
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-foreground hover:bg-accent"
                      }`}
                    >
                      <Pencil className="w-3 h-3" />
                      Geofence
                    </button>

                    <button
                      onClick={() =>
                        mapInstance?.setZoom((mapInstance?.getZoom() || 14) + 1)
                      }
                      className="p-2 text-xs rounded-md flex items-center gap-1.5 bg-background 
                        text-foreground hover:bg-accent transition-colors"
                    >
                      <ZoomIn className="w-3 h-3" />
                      Zoom In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Draggable>

        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={["drawing", "visualization", "geometry"]}
          onLoad={() => setGoogleLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={14}
            center={mapCenter}
            mapTypeId={mapType}
            options={{
              styles: [
                {
                  elementType: "geometry",
                  stylers: [{ color: "#242f3e" }],
                },
                {
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#242f3e" }],
                },
                {
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#746855" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#17263c" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ color: "#38414e" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#212a37" }],
                },
              ],
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
            onLoad={(map) => {
              setMapInstance(map);
              mapRef.current = map;

              const traffic = new google.maps.TrafficLayer();
              setTrafficLayer(traffic);

              const drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: drawingMode
                  ? google.maps.drawing.OverlayType.POLYGON
                  : null,
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeWeight: 2,
                  strokeColor: "#FF0000",
                  editable: true,
                },
              });

              drawingManager.setMap(map);

              // Handle polygon complete
              google.maps.event.addListener(
                drawingManager,
                "polygoncomplete",
                (polygon: google.maps.Polygon) => {
                  setGeofences((prev) => [...prev, polygon]);
                  drawingManager.setDrawingMode(null);
                  setDrawingMode(false);
                }
              );
            }}
          >
            {mockVehicles.map((vehicle) => (
              <React.Fragment key={vehicle.id}>
                <Marker
                  position={vehicle.coordinates}
                  icon={getMarkerIcon(vehicle)}
                  onClick={() => handleVehicleSelect(vehicle)}
                  {...(googleLoaded
                    ? { animation: google.maps.Animation.DROP }
                    : {})}
                />
                {showInfoWindow && selectedVehicle.id === vehicle.id && (
                  <InfoWindow
                    position={vehicle.coordinates}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    {renderInfoWindow(vehicle)}
                  </InfoWindow>
                )}
                {vehicle.status === "available" && (
                  <Circle
                    center={vehicle.coordinates}
                    radius={100}
                    options={{
                      fillColor: "#4CAF50",
                      fillOpacity: 0.1,
                      strokeColor: "#4CAF50",
                      strokeOpacity: 0.8,
                      strokeWeight: 1,
                    }}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Show heatmap layer */}
            {showHeatmap && (
              <HeatmapLayer
                data={getHeatmapData()}
                options={{
                  radius: 20,
                  opacity: 0.6,
                }}
              />
            )}

            {/* Show route */}
            {selectedRoute && (
              <DirectionsRenderer
                directions={selectedRoute}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#4A90E2",
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}

            {/* Show geofences */}
            {geofences.map((fence, index) => (
              <Polygon
                key={index}
                paths={fence.getPath()}
                options={{
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeWeight: 2,
                  strokeColor: "#FF0000",
                  editable: true,
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default FleetPage;
