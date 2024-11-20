// app/route.ts
import { NextResponse } from 'next/server';

// Mock data generator functions
const generateTimeSeriesData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    rides: Math.floor(Math.random() * 1000) + 500,
    revenue: Math.floor(Math.random() * 50000) + 25000,
  }));
};

const generatePeakHoursData = () => {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    rides: Math.floor(Math.random() * 200) + 50,
  }));
};

const generatePopularRoutes = () => {
  const routes = [
    'Downtown - Airport',
    'University - Shopping Mall',
    'Central Station - Business District',
    'Residential Area - City Center',
    'Sports Complex - Entertainment District',
  ];
  
  return routes.map(route => ({
    route,
    count: Math.floor(Math.random() * 1000) + 200,
    revenue: Math.floor(Math.random() * 10000) + 5000,
  }));
};

const generateSatisfactionData = () => {
  const categories = ['Overall', 'Driver', 'App', 'Support'];
  return categories.map(category => ({
    category,
    score: Math.floor(Math.random() * 30) + 70, // 70-100 range
  }));
};

// Mock data for each endpoint
const mockData = {
  'active-users': () => ({
    count: Math.floor(Math.random() * 5000) + 10000,
    activities: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      active: Math.floor(Math.random() * 1000) + 500,
    })),
  }),
  
  'registered-users': () => ({
    count: Math.floor(Math.random() * 10000) + 50000,
  }),
  
  'rides': () => ({
    total: Math.floor(Math.random() * 50000) + 100000,
    completionRate: Math.floor(Math.random() * 10) + 90,
    timeline: generateTimeSeriesData(7),
    revenue: generateTimeSeriesData(7),
  }),
  
  'ratings': () => ({
    average: (Math.random() * 1 + 4).toFixed(1),
    distribution: Array.from({ length: 5 }, (_, i) => ({
      rating: i + 1,
      count: Math.floor(Math.random() * 1000) + 100,
    })),
  }),
  
  'cancellation-rate': () => ({
    rate: Math.floor(Math.random() * 5) + 1,
  }),
  
  'ride-distance': () => ({
    average: Math.floor(Math.random() * 10) + 5,
  }),
  
  'ride-duration': () => ({
    average: Math.floor(Math.random() * 20) + 15,
  }),
  
  'driver-utilization': () => ({
    rate: Math.floor(Math.random() * 20) + 70,
  }),
  
  'rider-ratio': () => ({
    ratio: ((Math.random() * 2) + 4).toFixed(1),
  }),
  
  'driver-earnings': () => ({
    total: Math.floor(Math.random() * 1000000) + 2000000,
  }),
  
  'growth-rate': () => ({
    rate: Math.floor(Math.random() * 15) + 5,
  }),
  
  'peak-hours': () => ({
    data: generatePeakHoursData(),
  }),
  
  'popular-routes': () => ({
    data: generatePopularRoutes(),
  }),
  
  'user-growth': () => ({
    data: generateTimeSeriesData(7).map(item => ({
      ...item,
      users: Math.floor(Math.random() * 1000) + 500,
      drivers: Math.floor(Math.random() * 200) + 100,
    })),
  }),
  
  'satisfaction': () => ({
    data: generateSatisfactionData(),
  }),
};

export async function GET(
  request: Request,
  { params }: { params: { endpoint: string } }
) {
  const endpoint = params.endpoint;
  
  // Add artificial delay to simulate real API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (endpoint in mockData) {
    return NextResponse.json(mockData[endpoint as keyof typeof mockData]());
  }
  
  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}