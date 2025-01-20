import React from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/base/card";
import { LatLngTuple } from "leaflet";

const Map = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
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
}

const RevenueByLocation = () => {
  const locations: Location[] = [
    {
      location: "Kigali",
      percentage: 60,
      coordinates: [-1.9577, 30.1127] as LatLngTuple,
      amount: "91,200.00 RWF",
    },
    {
      location: "Eastern Province",
      percentage: 20,
      coordinates: [-1.6212, 30.5309] as LatLngTuple,
      amount: "30,400.00 RWF",
    },
    {
      location: "Western Province",
      percentage: 10,
      coordinates: [-2.4938, 29.8766] as LatLngTuple,
      amount: "15,200.00 RWF",
    },
    {
      location: "Northern Province",
      percentage: 5,
      coordinates: [-1.5648, 29.9921] as LatLngTuple,
      amount: "7,600.00 RWF",
    },
    {
      location: "Southern Province",
      percentage: 5,
      coordinates: [-2.5923, 29.7407] as LatLngTuple,
      amount: "7,600.00 RWF",
    },
  ];

  return (
    <Card className="p-5 dark:bg-background/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Revenue by Location
          </h2>
          <p className="text-sm text-muted-foreground">
            Distribution across provinces
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Map Section */}
        <div className="w-full lg:w-2/3">
          <div className="h-[300px] rounded-xl overflow-hidden border dark:border-border/5">
            <Map
              center={[-1.9577, 30.1127]}
              zoom={7}
              className="h-full w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {locations.map(({ location, coordinates }, index) => (
                <Marker position={coordinates} key={index}>
                  <Popup>{location}</Popup>
                </Marker>
              ))}
            </Map>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-1/3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-semibold text-foreground">
              152,000.00 RWF
            </p>
          </div>
          <div className="mt-6 space-y-4">
            {locations.map(({ location, percentage, amount }, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                    <span className="text-sm font-medium text-foreground">
                      {location}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {amount}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground min-w-[3rem]">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueByLocation;
