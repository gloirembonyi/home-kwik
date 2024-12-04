"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent 
} from '@/components/ui/base/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/base/tabs';
import { Badge } from '@/components/ui/base/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/base/table';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import {
  Users, Car, Clock, MapPin, CreditCard, Star, Calendar,
  TrendingUp, DollarSign, AlertCircle, CheckCircle, XCircle,
  Navigation, Heart, Shield, Activity
} from 'lucide-react';

// Define interfaces for our data types
interface TripData {
  id: string;
  date: string;
  riderName: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: number;
  earnings: string;
  status: 'Completed' | 'Cancelled' | 'Rejected';
  rating: number | null;
  acceptanceTime: number;
  incentives: string;
}

interface Activity {
  action: string;
  timestamp: string;
}

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: number;
  detail?: string;
}

// Mock data generator with proper typing
const generateDriverHistory = (count = 20): TripData[] => {
  const statuses: TripData['status'][] = ['Completed', 'Cancelled', 'Rejected'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `D${1000 + i}`,
      date: date.toISOString(),
      riderName: `Rider ${Math.floor(Math.random() * 100)}`,
      pickup: `Location ${Math.floor(Math.random() * 10)}`,
      dropoff: `Location ${Math.floor(Math.random() * 10)}`,
      distance: (Math.random() * 20 + 2).toFixed(1),
      duration: Math.floor(Math.random() * 45 + 10),
      earnings: (Math.random() * 40 + 8).toFixed(2),
      status,
      rating: status === 'Completed' ? Math.floor(Math.random() * 2 + 4) : null,
      acceptanceTime: Math.floor(Math.random() * 30 + 10),
      incentives: (Math.random() * 5).toFixed(2)
    };
  });
};

// Status Badge Component
const StatusBadge: React.FC<{ status: TripData['status'] }> = ({ status }) => {
  const statusStyles = {
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Rejected: 'bg-gray-100 text-gray-800'
  };

  const StatusIcon = {
    Completed: CheckCircle,
    Cancelled: XCircle,
    Rejected: XCircle
  }[status];

  return (
    <Badge className={`${statusStyles[status]} flex items-center gap-1`}>
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

// Rating Stars Component
const RatingStars: React.FC<{ rating: number | null }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Activity Timeline Component
const ActivityTimeline: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex-none">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-sm text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, trend, detail }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
            {detail && <p className="text-xs text-gray-400 mt-1">{detail}</p>}
          </div>
        </div>
        {trend !== undefined && (
          <Badge className={trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

const DriverHistory: React.FC = () => {
  const [history, setHistory] = useState<TripData[]>([]);
  const [activeTab, setActiveTab] = useState('trips');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHistory(generateDriverHistory());
      setIsLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalTrips: history.length,
    completedTrips: history.filter(trip => trip.status === 'Completed').length,
    averageRating: (history.reduce((acc, trip) => acc + (trip.rating || 0), 0) / 
      history.filter(trip => trip.rating).length).toFixed(1),
    totalEarnings: history.reduce((acc, trip) => acc + parseFloat(trip.earnings), 0).toFixed(2),
    totalIncentives: history.reduce((acc, trip) => acc + parseFloat(trip.incentives), 0).toFixed(2)
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Driver History
        </CardTitle>
        <CardDescription>
          Comprehensive view of driver activity and earnings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StatsCard 
            icon={Car}
            label="Total Rides"
            value={stats.totalTrips}
            trend={15}
          />
          <StatsCard 
            icon={CheckCircle}
            label="Completed"
            value={stats.completedTrips}
            detail={`${((stats.completedTrips / stats.totalTrips) * 100).toFixed(1)}% completion`}
          />
          <StatsCard 
            icon={Star}
            label="Rating"
            value={stats.averageRating}
            detail="From riders"
          />
          <StatsCard 
            icon={DollarSign}
            label="Earnings"
            value={`$${stats.totalEarnings}`}
            trend={10}
          />
          <StatsCard 
            icon={TrendingUp}
            label="Incentives"
            value={`$${stats.totalIncentives}`}
            trend={5}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="trips">Ride History</TabsTrigger>
            <TabsTrigger value="stats">Performance</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="trips">
            {/* Rest of the component remains the same, just with proper typing */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Rider</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        {new Date(trip.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{trip.id}</TableCell>
                      <TableCell>{trip.riderName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.pickup} → {trip.dropoff}
                        </div>
                      </TableCell>
                      <TableCell>{trip.duration} mins</TableCell>
                      <TableCell>${trip.earnings}</TableCell>
                      <TableCell>
                        <StatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>
                        {trip.rating !== null && <RatingStars rating={trip.rating} />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ride Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: stats.completedTrips },
                            { name: 'Other', value: stats.totalTrips - stats.completedTrips }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { rating: '5 stars', count: history.filter(t => t.rating === 5).length },
                          { rating: '4 stars', count: history.filter(t => t.rating === 4).length },
                          { rating: '3 stars', count: history.filter(t => t.rating === 3).length },
                          { rating: '2 stars', count: history.filter(t => t.rating === 2).length },
                          { rating: '1 star', count: history.filter(t => t.rating === 1).length }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rating" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="earnings" stroke="#22c55e" />
                        <Line type="monotone" dataKey="incentives" stroke="#3b82f6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="pt-6">
                <ActivityTimeline 
                  activities={history.map(trip => ({
                    action: `${trip.status} trip with ${trip.riderName} (${trip.pickup} → ${trip.dropoff})`,
                    timestamp: trip.date
                  }))}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DriverHistory;