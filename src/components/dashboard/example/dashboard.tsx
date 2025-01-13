
  
  // pages/dashboard.tsx
  interface StatsCardProps {
    title: string;
    value: string | number;
    isLoading?: boolean;
  }
  
  const StatsCard = ({ title, value, isLoading }: StatsCardProps) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {isLoading ? (
            <span className="animate-pulse bg-gray-200 rounded h-8 w-16 inline-block" />
          ) : (
            value
          )}
        </p>
      </CardContent>
    </Card>
  );
  
  // pages/dashboard.tsx
  import { useEffect, useState } from 'react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/base/card';
  import { Alert, AlertDescription } from '@/components/ui/base/alert';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/base/table';
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
  import { fetchDashboardStats, fetchActiveRides, fetchDrivers, DashboardError, DashboardStats, Driver, Ride } from './api/rideshare';
  import { Loader2 } from 'lucide-react';
  
  export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeRides, setActiveRides] = useState<Ride[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [errors, setErrors] = useState<DashboardError[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const newErrors: DashboardError[] = [];
  
        try {
          const statsData = await fetchDashboardStats();
          setStats(statsData);
        } catch (err) {
          newErrors.push({
            type: 'stats',
            message: 'Failed to fetch dashboard statistics'
          });
        }
  
        try {
          const ridesData = await fetchActiveRides();
          setActiveRides(ridesData);
        } catch (err) {
          newErrors.push({
            type: 'rides',
            message: 'Failed to fetch active rides'
          });
        }
  
        try {
          const driversData = await fetchDrivers();
          setDrivers(driversData);
        } catch (err) {
          newErrors.push({
            type: 'drivers',
            message: 'Failed to fetch drivers data'
          });
        }
  
        setErrors(newErrors);
        setLoading(false);
      };
  
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Error Messages Section */}
        {errors.length > 0 && (
          <div className="p-4 space-y-2 bg-white border-b">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
  
        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Ride-share Dashboard</h1>
            {loading && (
              <div className="flex items-center text-gray-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </div>
            )}
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Rides"
              value={stats?.totalRides || 0}
              isLoading={loading}
            />
            <StatsCard
              title="Active Drivers"
              value={stats?.activeDrivers || 0}
              isLoading={loading}
            />
            <StatsCard
              title="Completion Rate"
              value={`${stats?.completionRate || 0}%`}
              isLoading={loading}
            />
            <StatsCard
              title="Revenue Today"
              value={`$${stats?.revenueToday || 0}`}
              isLoading={loading}
            />
          </div>
  
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeRides}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="fare" stroke="#2563eb" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
  
          {/* Active Rides Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Rides</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : activeRides.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ride ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Fare</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRides.map((ride) => (
                      <TableRow key={ride.id}>
                        <TableCell>{ride.id}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            ride.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                            ride.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ride.status}
                          </span>
                        </TableCell>
                        <TableCell>{ride.pickup.address}</TableCell>
                        <TableCell>{ride.destination.address}</TableCell>
                        <TableCell>${ride.fare}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No active rides at the moment
                </div>
              )}
            </CardContent>
          </Card>
  
          {/* Driver Status */}
          <Card>
            <CardHeader>
              <CardTitle>Driver Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : drivers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Total Rides</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            driver.status === 'available' ? 'bg-green-100 text-green-800' :
                            driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {driver.status}
                          </span>
                        </TableCell>
                        <TableCell>⭐ {driver.rating.toFixed(1)}</TableCell>
                        <TableCell>{driver.totalRides}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No drivers available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }