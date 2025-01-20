import React from "react";
import { X } from "lucide-react";

interface RideDetailsProps {
  ride: {
    id: string;
    pickup: string;
    destination: string;
    driver: string;
    date: string;
    status: string;
    fare: string;
  };
  onClose: () => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({ ride, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-background border border-border rounded-xl shadow-lg p-8 space-y-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="border-b border-border pb-4">
          <h1 className="text-2xl font-bold text-foreground">{ride.id}</h1>
          <p className="text-muted-foreground text-sm">
            Details for selected ride
          </p>
        </div>

        {/* Ride Details */}
        <div className="grid grid-cols-3 gap-x-12 gap-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Pickup
            </h2>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-3" />
              <p className="text-foreground text-sm">{ride.pickup}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Destination
            </h2>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3" />
              <p className="text-foreground text-sm">{ride.destination}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Duration
            </h2>
            <p className="text-foreground text-sm mt-1">3 min</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              Distance
            </h2>
            <p className="text-foreground text-sm mt-1">30 m</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Cost</h2>
            <p className="text-foreground text-sm mt-1">20,000 Rwf</p>
          </div>
        </div>

        {/* Driver Details */}
        <div className="border-t border-border pt-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Driver Details
          </h2>
          <div className="flex items-center space-x-4 mt-4">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div>
              <p className="font-medium text-foreground">{ride.driver}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-blue-600">Verified</span> • 4.5 stars •
                120 rides
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-4">
            <p>RAA 234 F</p>
            <p>White • Toyota RAV4</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
