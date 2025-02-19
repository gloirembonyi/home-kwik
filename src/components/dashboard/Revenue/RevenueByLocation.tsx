"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/base/card";
import { ChevronDown, ChevronUp, Map as MapIcon } from "lucide-react";
import { useTheme } from "next-themes";
import L from "leaflet";
import { MapSkeleton, CardSkeleton } from "@/components/ui/LoadingState";

type LatLngTuple = [number, number];

// Dynamic imports for Leaflet components with loading state
const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Location {
  location: string;
  percentage: number;
  coordinates: LatLngTuple;
  amount: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

const RevenueByLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [customIcon, setCustomIcon] = useState<L.DivIcon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setCustomIcon(
        L.divIcon({
          className: "custom-marker",
          html: '<div class="w-4 h-4 bg-primary rounded-full border-2 border-background"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
      );
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  const locations: Location[] = [
    {
      location: "Kigali",
      percentage: 60,
      coordinates: [-1.9577, 30.1127],
      amount: "91,200.00 RWF",
      change: "+5.2%",
      trend: "up",
    },
    {
      location: "Eastern Province",
      percentage: 20,
      coordinates: [-1.6212, 30.5309],
      amount: "30,400.00 RWF",
      change: "+2.1%",
      trend: "up",
    },
    {
      location: "Western Province",
      percentage: 10,
      coordinates: [-2.4938, 29.8766],
      amount: "15,200.00 RWF",
      change: "-1.3%",
      trend: "down",
    },
    {
      location: "Northern Province",
      percentage: 5,
      coordinates: [-1.5648, 29.9921],
      amount: "7,600.00 RWF",
      change: "0%",
      trend: "neutral",
    },
    {
      location: "Southern Province",
      percentage: 5,
      coordinates: [-2.5923, 29.7407],
      amount: "7,600.00 RWF",
      change: "+0.8%",
      trend: "up",
    },
  ];

  const totalRevenue = locations.reduce((sum, loc) => {
    const amount = parseFloat(loc.amount.replace(/[^0-9.-]+/g, ""));
    return sum + amount;
  }, 0);

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Revenue by Location
          </h2>
          <p className="text-sm text-muted-foreground">
            Distribution across provinces
          </p>
        </div>
        <button
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {isMapExpanded ? (
            <ChevronDown className="h-5 w-5 text-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Map Section */}
        <div
          className={`w-full ${
            isMapExpanded ? "lg:w-full" : "lg:w-2/3"
          } transition-all duration-300`}
        >
          <div
            className={`rounded-xl overflow-hidden border border-border transition-all duration-300 ${
              isMapExpanded ? "h-[600px]" : "h-[300px]"
            }`}
          >
            {isClient && (
              <Map
                center={
                  selectedLocation
                    ? locations.find((l) => l.location === selectedLocation)
                        ?.coordinates
                    : [-1.9577, 30.1127]
                }
                zoom={selectedLocation ? 9 : 7}
                className={`h-full w-full ${
                  isDark
                    ? "[&_.leaflet-tile]:brightness-[0.7] [&_.leaflet-tile]:contrast-[0.8] [&_.leaflet-tile]:hue-rotate-[180deg] [&_.leaflet-tile]:invert-[0.9]"
                    : ""
                }`}
                scrollWheelZoom={true}
                zoomControl={true}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {customIcon &&
                  locations.map(
                    ({ location, coordinates, amount, percentage }, index) => (
                      <Marker
                        position={coordinates}
                        key={index}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => setSelectedLocation(location),
                        }}
                      >
                        <Popup className="bg-popover border-none text-popover-foreground">
                          <div className="p-2">
                            <h3 className="font-semibold text-foreground">
                              {location}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Revenue: {amount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Market Share: {percentage}%
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  )}
              </Map>
            )}
          </div>
        </div>

        {/* Details Section */}
        {!isMapExpanded && (
          <div className="w-full lg:w-1/3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-semibold text-foreground">
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                RWF
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {locations.map(
                ({ location, percentage, amount, change, trend }, index) => (
                  <div
                    key={index}
                    className={`space-y-2 p-2 rounded-lg transition-colors cursor-pointer
                    ${
                      selectedLocation === location
                        ? "bg-primary/10"
                        : "hover:bg-accent"
                    }
                  `}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {amount}
                        </span>
                        <span className={`text-xs ${getTrendColor(trend)}`}>
                          {change}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 bg-accent rounded-full flex-1 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground min-w-[3rem]">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {isClient && (
        <style jsx global>{`
          .custom-marker {
            background: transparent;
          }
          .leaflet-popup-content-wrapper {
            background: ${isDark ? "#18181b" : "#ffffff"};
            color: ${isDark ? "#ffffff" : "#000000"};
            border: 1px solid ${isDark ? "#27272a" : "#e5e7eb"};
          }
          .leaflet-popup-tip {
            background: ${isDark ? "#18181b" : "#ffffff"};
            border: 1px solid ${isDark ? "#27272a" : "#e5e7eb"};
          }
          .leaflet-container {
            background: ${isDark ? "#0a0a0a" : "#ffffff"};
          }
        `}</style>
      )}
    </Card>
  );
};

export default RevenueByLocation;
