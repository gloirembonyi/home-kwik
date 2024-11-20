import { Users, Car, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import MetricCard from '@/components/metric/MetricCard';


// components/RealtimeMetrics.tsx
const RealtimeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    activeDrivers: 0,
    pendingRequests: 0,
    averageWaitTime: 0
  });

  useEffect(() => {
    const fetchRealtimeData = () => {
      // Simulate realtime data - replace with actual WebSocket connection
      setMetrics({
        activeUsers: Math.floor(Math.random() * 1000) + 500,
        activeDrivers: Math.floor(Math.random() * 500) + 200,
        pendingRequests: Math.floor(Math.random() * 50) + 10,
        averageWaitTime: Math.floor(Math.random() * 10) + 2
      });
    };

    const interval = setInterval(fetchRealtimeData, 5000);
    fetchRealtimeData(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers}
        icon={<Users className="h-4 w-4" />}
        color="blue"
      />
      <MetricCard
        title="Active Drivers"
        value={metrics.activeDrivers}
        icon={<Car className="h-4 w-4" />}
        color="green"
      />
      <MetricCard
        title="Pending Requests"
        value={metrics.pendingRequests}
        icon={<Clock className="h-4 w-4" />}
        color="yellow"
      />
      <MetricCard
        title="Avg Wait Time"
        value={`${metrics.averageWaitTime} min`}
        icon={<Clock className="h-4 w-4" />}
        color="purple"
      />
    </div>
  );
};
