// import React, { useEffect, useRef, useState, useMemo } from "react";
// import {
//   MapIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   ExclamationTriangleIcon,
//   MapPinIcon,
// } from '@heroicons/react/24/solid';
// import { FilterIcon } from "lucide-react";
// import { FaSync } from "react-icons/fa";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/base/dropdown-menu";
// import { Button } from "@/components/ui/base/button";
// import { Badge } from "@/components/ui/base/badge";
// import { Ride } from "@/types/map";



// export interface RideTrackingMapProps {
//     apiKey: string;
//     fetchRidesEndpoint: string;
//     realTimeUpdatesEndpoint?: string;
//     onRideSelect?: (ride: Ride) => void;
//   }

// // Advanced Utility Functions
// const getMarkerDetails = (status: Ride['status']) => {
//   const statusConfig = {
//     'active': { 
//       color: '#10B981', 
//       icon: <MapIcon className="text-green-500 w-6 h-6" />,
//       label: 'Active Ride',
//       severity: 3
//     },
//     'scheduled': { 
//       color: '#FBBF24', 
//       icon: <ClockIcon className="text-yellow-500 w-6 h-6" />,
//       label: 'Scheduled Ride',
//       severity: 1
//     },
//     'completed': { 
//       color: '#6B7280', 
//       icon: <CheckCircleIcon className="text-gray-500 w-6 h-6" />,
//       label: 'Completed Ride',
//       severity: 0
//     },
//     'delayed': { 
//       color: '#EF4444', 
//       icon: <ExclamationTriangleIcon className="text-red-500 w-6 h-6" />,
//       label: 'Delayed Ride',
//       severity: 4
//     },
//     'emergency': { 
//       color: '#DC2626', 
//       icon: <ExclamationTriangleIcon className="text-red-800 w-6 h-6" />,
//       label: 'Emergency Situation',
//       severity: 5
//     }
//   };

//   return statusConfig[status] || { 
//     color: '#6366F1', 
//     icon: <MapPinIcon className="text-indigo-500 w-6 h-6" />, 
//     label: 'Unknown Status',
//     severity: -1
//   };
// };

// // Advanced Google Maps Script Loading Hook
// const useGoogleMapsScript = (apiKey: string) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     if (!apiKey) {
//       setError(new Error('Google Maps API key is required'));
//       return;
//     }

//     if (window.google && window.google.maps) {
//       setIsLoaded(true);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization,geometry,places,marker`;
//     script.async = true;

//     script.onload = () => {
//       setIsLoaded(true);
//     };

//     script.onerror = () => {
//       setError(new Error('Failed to load Google Maps script. Check your API key and network connection.'));
//     };

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [apiKey]);

//   return { isLoaded, error };
// };

// // Advanced Ride Tracking Map Component
// const RideTrackingMap: React.FC<RideTrackingMapProps> = ({ 
//   apiKey, 
//   fetchRidesEndpoint, 
//   realTimeUpdatesEndpoint,
//   onRideSelect 
// }) => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<google.maps.Map | null>(null);
//   const markersRef = useRef<{[key: string]: google.maps.marker.AdvancedMarkerElement}>({});
  
//   const [rides, setRides] = useState<Ride[]>([]);
//   const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
//   const [filters, setFilters] = useState<Ride['status'][]>(['active', 'scheduled', 'delayed', 'emergency']);

//   const { isLoaded, error } = useGoogleMapsScript(apiKey);

//   // Fetch Rides from API
//   const fetchRides = async () => {
//     try {
//       const response = await fetch(fetchRidesEndpoint, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authentication headers if needed
//           // 'Authorization': `Bearer ${authToken}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch rides');
//       }

//       const data = await response.json();
//       setRides(data);
//     } catch (error) {
//       console.error('Error fetching rides:', error);
//       // Optionally show error toast or notification
//     }
//   };

//   // Set up Real-Time Updates (WebSocket or Server-Sent Events)
//   useEffect(() => {
//     if (!realTimeUpdatesEndpoint) return;

//     // Example WebSocket implementation
//     const socket = new WebSocket(realTimeUpdatesEndpoint);

//     socket.onopen = () => {
//       console.log('Connected to real-time ride updates');
//     };

//     socket.onmessage = (event) => {
//       const updatedRide = JSON.parse(event.data);
//       setRides(prevRides => {
//         const index = prevRides.findIndex(r => r.id === updatedRide.id);
//         if (index !== -1) {
//           const newRides = [...prevRides];
//           newRides[index] = updatedRide;
//           return newRides;
//         }
//         return [...prevRides, updatedRide];
//       });
//     };

//     socket.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [realTimeUpdatesEndpoint]);

//   // Initial Rides Fetch
//   useEffect(() => {
//     fetchRides();
//     // Optionally set up periodic refresh
//     const intervalId = setInterval(fetchRides, 60000); // Refresh every minute
//     return () => clearInterval(intervalId);
//   }, [fetchRidesEndpoint]);

//   // Map Rendering and Marker Management
//   useEffect(() => {
//     if (error || !isLoaded || !mapContainer.current) {
//       return;
//     }

//     // Create or update map
//     if (!map.current) {
//       map.current = new window.google.maps.Map(mapContainer.current, {
//         center: { lat: 40.7128, lng: -74.006 }, // Default to NYC, adjust as needed
//         zoom: 11,
//         mapTypeId: 'roadmap',
//         styles: [
//           {
//             featureType: 'poi',
//             stylers: [{ visibility: 'off' }]
//           },
//           {
//             featureType: 'transit',
//             stylers: [{ visibility: 'simplified' }]
//           }
//         ],
//         mapTypeControl: true,
//         zoomControl: true,
//         fullscreenControl: true,
//       });
//     }

//     // Clear existing markers
//     Object.values(markersRef.current).forEach(marker => marker.map = null);
//     markersRef.current = {};

//     // Add new markers for filtered rides
//     rides
//       .filter(ride => filters.includes(ride.status))
//       .forEach((ride) => {
//         const markerDetails = getMarkerDetails(ride.status);
        
//         const marker = new window.google.maps.marker.AdvancedMarkerElement({
//           position: {
//             lat: ride.pickupLocation.coordinates[1],
//             lng: ride.pickupLocation.coordinates[0],
//           },
//           map: map.current!,
//           title: ride.id,
//           content: (() => {
//             const markerElement = document.createElement('div');
//             markerElement.innerHTML = `
//               <div class="relative">
//                 <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="20" cy="20" r="18" fill="${markerDetails.color}" stroke="white" stroke-width="3" />
//                 </svg>
//                 <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//                   ${markerDetails.icon.props.className}
//                 </div>
//               </div>
//             `;
//             return markerElement;
//           })(),
//         });

//         // Draw route if available
//         if (ride.route && ride.route.length > 1) {
//           const routePath = new window.google.maps.Polyline({
//             path: ride.route.map(coord => ({
//               lat: coord[1],
//               lng: coord[0]
//             })),
//             geodesic: true,
//             strokeColor: markerDetails.color,
//             strokeOpacity: 0.7,
//             strokeWeight: 4
//           });
//           routePath.setMap(map.current);
//         }

//         const infoWindow = new window.google.maps.InfoWindow({
//           content: `
//             <div class="p-4 max-w-xs">
//               <div class="flex justify-between items-center mb-2">
//                 <h3 class="font-bold text-lg">${ride.id}</h3>
//                 <span class="text-sm text-gray-500 capitalize">${markerDetails.label}</span>
//               </div>
//               <div class="space-y-2">
//                 <div>
//                   <p class="font-semibold">Pickup: ${ride.pickupLocation.address}</p>
//                   <p class="font-semibold">Dropoff: ${ride.dropoffLocation.address}</p>
//                 </div>
//                 ${ride.driver ? `
//                   <div>
//                     <p class="font-semibold">${ride.driver.name}</p>
//                     <p class="text-sm text-gray-600">${ride.driver.vehicle.model}</p>
//                     <div class="flex items-center text-sm">
//                       ⭐ ${ride.driver.rating}/5
//                     </div>
//                   </div>
//                 ` : ''}
//                 <div class="flex justify-between">
//                   <span>Passengers:</span>
//                   <span class="font-semibold">${ride.passengers}</span>
//                 </div>
//                 ${ride.estimatedArrival ? `
//                   <div class="flex justify-between">
//                     <span>Estimated Arrival:</span>
//                     <span class="font-semibold">${ride.estimatedArrival}</span>
//                   </div>
//                 ` : ''}
//                 ${ride.distance ? `
//                   <div class="flex justify-between">
//                     <span>Distance:</span>
//                     <span class="font-semibold">${ride.distance} km</span>
//                   </div>
//                 ` : ''}
//               </div>
//             </div>
//           `,
//         });

//         marker.addListener('click', () => {
//           infoWindow.open({
//             map: map.current!,
//             anchor: marker,
//           });
//           setSelectedRide(ride);
//           onRideSelect?.(ride);
//         });

//         // Store marker for future management
//         markersRef.current[ride.id] = marker;
//       });

//   }, [rides, filters, isLoaded, error, onRideSelect]);

//   // Render loading or error state
//   if (error) {
//     return (
//       <div className="w-full h-full flex items-center justify-center text-red-500">
//         Error loading map: {error.message}
//       </div>
//     );
//   }

//   if (!isLoaded) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
//         <span className="ml-4">Loading advanced ride tracking map...</span>
//       </div>
//     );
//   }

//   // Filter Toggle Component
//   const RideStatusFilterDropdown = () => {
//     const statusOptions: Ride['status'][] = ['active', 'scheduled', 'completed', 'delayed', 'emergency'];

//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" className="flex items-center">
//             <FilterIcon className="h-4 w-4 mr-2" />
//             Filter Rides
//             {filters.length < statusOptions.length && (
//               <Badge variant="secondary" className="ml-2">
//                 {filters.length}
//               </Badge>
//             )}
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56">
//           <DropdownMenuLabel className="flex items-center">
//             <FilterIcon className="h-4 w-4 mr-2 text-blue-500" />
//             Ride Status Filters
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {statusOptions.map((status) => {
//             const details = getMarkerDetails(status);
//             const isActive = filters.includes(status);
            
//             return (
//               <DropdownMenuCheckboxItem
//                 key={status}
//                 checked={isActive}
//                 onCheckedChange={() => {
//                   setFilters(prev => 
//                     isActive 
//                       ? prev.filter(f => f !== status)
//                       : [...prev, status]
//                   );
//                 }}
//                 className="capitalize"
//               >
//                 <div className="flex items-center">
//                   {details.icon}
//                   <span className="ml-2">{details.label}</span>
//                 </div>
//               </DropdownMenuCheckboxItem>
//             );
//           })}
//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             onSelect={(e) => {
//               e.preventDefault();
//               setFilters(statusOptions); // Select all
//             }}
//             className="text-xs text-blue-600 hover:text-blue-700"
//           >
//             Select All
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onSelect={(e) => {
//               e.preventDefault();
//               setFilters([]); // Deselect all
//             }}
//             className="text-xs text-red-600 hover:text-red-700"
//           >
//             Clear Selection
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   };

//   const LegendDropdown = () => {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" className="flex items-center">
//             <FaSync className="h-4 w-4 mr-2 text-green-500" />
//             Ride Status Legend
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56">
//           <DropdownMenuLabel className="flex items-center">
//             <FaSync className="h-4 w-4 mr-2 text-green-500" />
//             Ride Status Details
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           {(['active', 'scheduled', 'completed', 'delayed', 'emergency'] as Ride['status'][]).map((status) => {
//             const details = getMarkerDetails(status);
//             return (
//               <DropdownMenuItem key={status} disabled className="capitalize">
//                 <div className="flex items-center">
//                   {details.icon}
//                   <span className="ml-2">{details.label}</span>
//                 </div>
//               </DropdownMenuItem>
//             );
//           })}
          
//           {selectedRide && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuLabel>Selected Ride Details</DropdownMenuLabel>
//               <div className="px-2 py-1 text-xs space-y-1">
//                 <p><strong>ID:</strong> {selectedRide.id}</p>
//                 <p><strong>Status:</strong> {selectedRide.status}</p>
//                 <p><strong>Pickup:</strong> {selectedRide.pickupLocation.address}</p>
//                 <p><strong>Dropoff:</strong> {selectedRide.dropoffLocation.address}</p>
//               </div>
//             </>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   };

//   return (
//     <div className="w-full h-full relative">
//       <div ref={mapContainer} className="w-full h-full" />
      
//       {/* Ride Status Filter Dropdown */}
//       <div className="absolute top-4 left-4 z-10 flex space-x-2">
//         <RideStatusFilterDropdown />
//         <LegendDropdown />
//       </div>

//       {/* Real-Time Update Indicator */}
//       <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded-xl shadow-lg border border-gray-200 text-xs flex items-center">
//         <div className="w-2 h-2 rounded-full mr-2 animate-pulse bg-green-500"></div>
//         Last Updated: {new Date().toLocaleTimeString()}
//       </div>
//     </div>
//   );
// };

// export default RideTrackingMap;




