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
  Navigation, Heart, Shield, Activity, LucideIcon
} from 'lucide-react';

// Type definitions
interface Trip {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: number;
  fare: string;
  status: 'Completed' | 'Cancelled' | 'No Show';
  rating: number | null;
  driverName: string;
  paymentMethod: string;
  waitTime: number;
}

interface Stats {
  totalTrips: number;
  completedTrips: number;
  averageRating: string;
  totalSpent: string;
}

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  detail?: string;
}

interface StatusBadgeProps {
  status: Trip['status'];
}

interface RatingStarsProps {
  rating: number | null;
}

// Mock data generator
const generateRiderHistory = (count = 20): Trip[] => {
  const statuses: Trip['status'][] = ['Completed', 'Cancelled', 'No Show'];
  const paymentMethods = ['Credit Card', 'Cash', 'Digital Wallet'];
  const locations = ['Downtown', 'Airport', 'Shopping Mall', 'Business District', 'Residential Area'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `R${1000 + i}`,
      date: date.toISOString(),
      pickup: locations[Math.floor(Math.random() * locations.length)],
      dropoff: locations[Math.floor(Math.random() * locations.length)],
      distance: (Math.random() * 20 + 2).toFixed(1),
      duration: Math.floor(Math.random() * 45 + 10),
      fare: (Math.random() * 50 + 10).toFixed(2),
      status,
      rating: status === 'Completed' ? Math.floor(Math.random() * 2 + 4) : null,
      driverName: `Driver ${Math.floor(Math.random() * 100)}`,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      waitTime: Math.floor(Math.random() * 10 + 2)
    };
  });
};

// Status Badge Component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    'No Show': 'bg-yellow-100 text-yellow-800'
  };

  const StatusIcon = {
    Completed: CheckCircle,
    Cancelled: XCircle,
    'No Show': AlertCircle
  }[status];

  return (
    <Badge className={`${statusStyles[status]} flex items-center gap-1`}>
      <StatusIcon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

// Rating Stars Component
const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
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
        {trend && (
          <Badge className={trend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

// Rider History Component
const RiderHistory: React.FC = () => {
  const [history, setHistory] = useState<Trip[]>([]);
  const [activeTab, setActiveTab] = useState('trips');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHistory(generateRiderHistory());
      setIsLoading(false);
    }, 1000);
  }, []);

  const stats: Stats = {
    totalTrips: history.length,
    completedTrips: history.filter(trip => trip.status === 'Completed').length,
    averageRating: (history.reduce((acc, trip) => acc + (trip.rating || 0), 0) / 
      history.filter(trip => trip.rating).length).toFixed(1),
    totalSpent: history.reduce((acc, trip) => acc + parseFloat(trip.fare), 0).toFixed(2)
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Rider History
        </CardTitle>
        <CardDescription>
          Detailed view of rider history and statistics
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            icon={Car}
            label="Total Rides"
            value={stats.totalTrips}
            trend={12}
          />
          <StatsCard 
            icon={CheckCircle}
            label="Completed Rides"
            value={stats.completedTrips}
            detail={`${((stats.completedTrips / stats.totalTrips) * 100).toFixed(1)}% completion rate`}
          />
          <StatsCard 
            icon={Star}
            label="Average Rating"
            value={stats.averageRating}
            detail="Based on completed trips"
          />
          <StatsCard 
            icon={DollarSign}
            label="Total Spent"
            value={`$${stats.totalSpent}`}
            trend={8}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="trips">Ride History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="trips">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Fare</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="text-sm">
                            {trip.pickup} → {trip.dropoff}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{trip.driverName}</TableCell>
                      <TableCell>${trip.fare}</TableCell>
                      <TableCell>
                        <StatusBadge status={trip.status} />
                      </TableCell>
                      <TableCell>
                        {trip.rating && <RatingStars rating={trip.rating} />}
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
                  <CardTitle>Ride Distribution</CardTitle>
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
                  <CardTitle>Spending Trends</CardTitle>
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
                        <Line type="monotone" dataKey="fare" stroke="#3b82f6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Ride ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        {new Date(trip.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{trip.id}</TableCell>
                      <TableCell>${trip.fare}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {trip.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Processed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiderHistory;