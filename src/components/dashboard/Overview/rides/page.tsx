"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  ChevronRightIcon, 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  ClockIcon 
} from "@heroicons/react/24/solid";


const Map = dynamic(() => import("../dashboard/will-used/map/StarticMap"), { ssr: false });

// Define a more comprehensive Ride interface
interface Ride {
  id: string;
  location: string;
  driver?: string;
  vehicle?: string;
  events?: RideEvent[];
  status: 'Ongoing' | 'Completed' | 'Scheduled';
  passengers?: number;
}

interface RideEvent {
  status: string;
  time: string;
}

export default function RidesManagement() {
  // Sample rides with more detailed information
  const [rides, setRides] = useState<Ride[]>([
    {
      id: "DR-653CD3",
      location: "Kigali, Rwanda",
      driver: "John Doe",
      vehicle: "Toyota Camry",
      status: "Ongoing",
      passengers: 2,
      events: [
        { status: "Pickup", time: "7:53 AM" },
        { status: "Ongoing trip", time: "8:02 AM" },
        { status: "Arrived", time: "8:18 AM" },
      ]
    },
    {
      id: "DR-653CD4",
      location: "Nairobi, Kenya",
      driver: "Jane Smith",
      vehicle: "Honda Civic",
      status: "Scheduled",
      passengers: 1,
    },
    {
      id: "DR-653CD5",
      location: "Kampala, Uganda",
      driver: "Mike Johnson",
      vehicle: "Ford Focus",
      status: "Completed",
      passengers: 3,
    }
  ]);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rides based on search term
  const filteredRides = rides.filter(ride => 
    ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ride.driver?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-800">Rides Management</h1>
          
          {/* Enhanced Search Input */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search rides, locations, drivers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-72 border-2 border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition duration-300 ease-in-out"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </header>

        <div className="flex mt-6 space-x-6">
          {/* Enhanced Fleet List */}
          <div className="w-1/3 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Active Fleet</h2>
              <span className="text-sm text-gray-500">
                {filteredRides.length} rides
              </span>
            </div>
            
            {filteredRides.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No rides found
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredRides.map((ride, idx) => (
                  <li 
                    key={idx} 
                    className={`p-4 rounded-lg shadow-md transition-all duration-300 
                      ${ride.status === 'Ongoing' ? 'bg-green-50 border-l-4 border-green-500' : 
                        ride.status === 'Scheduled' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                        'bg-gray-50 border-l-4 border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{ride.id}</p>
                        <div className="flex items-center text-sm text-gray-600 space-x-2">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{ride.location}</span>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>{ride.status}</span>
                      </div>
                      {ride.passengers && (
                        <span>
                          {ride.passengers} 
                          {ride.passengers === 1 ? ' Passenger' : ' Passengers'}
                        </span>
                      )}
                    </div>

                    {ride.events && (
                      <ul className="mt-3 text-xs text-gray-500 space-y-1">
                        {ride.events.map((event, idx) => (
                          <li 
                            key={idx} 
                            className="flex justify-between bg-white p-2 rounded"
                          >
                            <span>{event.status}</span>
                            <span>{event.time}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Map */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">

          {/* <RideTrackingMap 
            apiKey="YOUR_GOOGLE_MAPS_API_KEY" 
            fetchRidesEndpoint="/api/rides"
            realTimeUpdatesEndpoint="wss://your-websocket-endpoint"
            onRideSelect={(ride) => console.log('Selected ride:', ride)}
          /> */}

          <Map 
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} 
              onLocationSelect={(location) => {
                // Optional: Add any additional logic when a location is selected
                console.log('Selected Location:', location);
              }} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
