// __tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import Dashboard from '../dashboard/page';
import { AnalyticsApiService } from '@/services/analyticsService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the analytics service
jest.mock('../services/analyticsService', () => ({
  AnalyticsApiService: {
    getInstance: jest.fn(),
  },
}));

// Mock third-party analytics services
jest.mock('rollbar', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

jest.mock('react-hotjar', () => ({
  hotjar: {
    initialize: jest.fn(),
    event: jest.fn(),
  },
}));

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn(),
}));

// Mock data
const mockDashboardData = {
  activeUsers: 1000,
  registeredUsers: 5000,
  totalRides: 10000,
  averageRating: 4.5,
  rideStats: [
    { date: '2024-01-01', rides: 100, revenue: 1000 },
    { date: '2024-01-02', rides: 120, revenue: 1200 },
  ],
  driverStats: [
    { rating: 4, count: 50 },
    { rating: 5, count: 30 },
  ],
  userActivities: [
    { hour: 8, active: 100 },
    { hour: 9, active: 150 },
  ],
  revenueData: [
    { date: '2024-01-01', amount: 1000, type: 'revenue' },
    { date: '2024-01-02', amount: 1200, type: 'revenue' },
  ],
  completionRate: 95,
  cancellationRate: 5,
  riderToDriverRatio: 4.5,
  averageRideDistance: 8.5,
  averageRideDuration: 25,
  driverUtilization: 85,
  driverEarnings: 50000,
  growthRate: 15,
  peakHours: [
    { hour: '08:00', rides: 100 },
    { hour: '09:00', rides: 150 },
  ],
  popularRoutes: [
    { route: 'Downtown - Airport', count: 500, revenue: 10000 },
    { route: 'University - Mall', count: 300, revenue: 6000 },
  ],
  userGrowth: [
    { date: '2024-01-01', users: 1000, drivers: 200 },
    { date: '2024-01-02', users: 1100, drivers: 220 },
  ],
  customerSatisfaction: [
    { category: 'Overall', score: 90 },
    { category: 'Driver Behavior', score: 85 },
  ],
};

// Mock API service instance
const mockAnalyticsService = {
  fetchDashboardData: jest.fn(),
  exportData: jest.fn(),
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AnalyticsApiService.getInstance as jest.Mock).mockReturnValue(mockAnalyticsService);
    mockAnalyticsService.fetchDashboardData.mockResolvedValue(mockDashboardData);
  });

  it('renders dashboard and fetches initial data', async () => {
    render(<Dashboard />);

    // Check loading state
    expect(screen.getByText(/Kwik Ride Analytics/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('skeleton')).toBeTruthy();

    // Wait for data to load
    await waitFor(() => {
      expect(mockAnalyticsService.fetchDashboardData).toHaveBeenCalledWith('week');
    });

    // Verify key metrics are displayed
    expect(screen.getByText('1,000')).toBeInTheDocument(); // Active Users
    expect(screen.getByText('$50,000')).toBeInTheDocument(); // Total Revenue
    expect(screen.getByText('95%')).toBeInTheDocument(); // Completion Rate
  });

  it('handles time range changes', async () => {
    render(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockAnalyticsService.fetchDashboardData).toHaveBeenCalledWith('week');
    });

    // Change time range
    const timeRangeSelect = screen.getByRole('combobox');
    fireEvent.change(timeRangeSelect, { target: { value: 'month' } });

    // Verify new data is fetched
    await waitFor(() => {
      expect(mockAnalyticsService.fetchDashboardData).toHaveBeenCalledWith('month');
    });
  });

  it('handles data refresh', async () => {
    render(<Dashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockAnalyticsService.fetchDashboardData).toHaveBeenCalledWith('week');
    });

    // Click refresh button
    const refreshButton = screen.getByText(/Refresh/i);
    fireEvent.click(refreshButton);

    // Verify data is refetched
    await waitFor(() => {
      expect(mockAnalyticsService.fetchDashboardData).toHaveBeenCalledTimes(2);
    });
  });

  it('handles export functionality', async () => {
    const mockBlob = new Blob(['test data'], { type: 'text/csv' });
    mockAnalyticsService.exportData.mockResolvedValue(mockBlob);

    render(<Dashboard />);

    // Click export button and select CSV
    const exportButton = screen.getByText(/Export/i);
    fireEvent.click(exportButton);
    const csvOption = screen.getByText(/Export as CSV/i);
    fireEvent.click(csvOption);

    // Verify export was called
    await waitFor(() => {
      expect(mockAnalyticsService.exportData).toHaveBeenCalledWith('csv', 'week');
    });
  });

  it('displays error state when API fails', async () => {
    mockAnalyticsService.fetchDashboardData.mockRejectedValue(new Error('API Error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load dashboard data/i)).toBeInTheDocument();
    });
  });
});

describe('AnalyticsApiService', () => {
  const service = AnalyticsApiService.getInstance();
  const mockResponse = {
    data: {
      success: true,
      data: mockDashboardData,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue(mockResponse);
  });

  it('fetches dashboard data successfully', async () => {
    const result = await service.fetchDashboardData('week');

    expect(result).toEqual(mockDashboardData);
    expect(mockedAxios.get).toHaveBeenCalledTimes(13); // One call for each endpoint
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    await expect(service.fetchDashboardData('week')).rejects.toThrow('API Error');
  });

  it('handles data export', async () => {
    const mockBlob = new Blob(['test data'], { type: 'text/csv' });
    mockedAxios.get.mockResolvedValueOnce({ data: mockBlob });

    const result = await service.exportData('csv', 'week');

    expect(result).toEqual(mockBlob);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/analytics/export?format=csv&timeRange=week'),
      expect.any(Object)
    );
  });

  it('handles authentication token', async () => {
    localStorage.setItem('token', 'test-token');

    await service.fetchDashboardData('week');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );

    localStorage.removeItem('token');
  });
});