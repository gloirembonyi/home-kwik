// analyticsService.ts
import axios, { AxiosResponse } from 'axios';

const BASE_URL = '';


// Request configuration
const createAxiosConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export class AnalyticsApiService {
  private static instance: AnalyticsApiService;
  private constructor() {
    // Initialize axios interceptors
    
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): AnalyticsApiService {
    if (!AnalyticsApiService.instance) {
      AnalyticsApiService.instance = new AnalyticsApiService();
    }
    return AnalyticsApiService.instance;
  }

  async fetchDashboardData(timeRange: string) {
    try {
      const [
        activeUsers,
        registeredUsers,
        rides,
        driverRatings,
        rideDistance,
        rideDuration,
        driverUtilization,
        riderRatio,
        earnings,
        growthRate,
        popularRoutes,
        peakHours,
        satisfaction
      ] = await Promise.all([
        this.getActiveUsers(timeRange),
        this.getRegisteredUsers(timeRange),
        this.getRides(timeRange),
        this.getDriverRatings(timeRange),
        this.getAverageRideDistance(timeRange),
        this.getAverageRideDuration(timeRange),
        this.getDriverUtilizationRate(timeRange),
        this.getRiderToDriverRatio(timeRange),
        this.getDriverEarnings(timeRange),
        this.getGrowthRate(timeRange),
        this.getPopularRoutes(timeRange),
        this.getPeakHours(timeRange),
        this.getCustomerSatisfaction(timeRange)
      ]);
  
      return {
        activeUsers: activeUsers?.data?.count || 0,
        registeredUsers: registeredUsers?.data?.count || 0,
        totalRides: rides?.data?.total || 0,
        averageRating: driverRatings?.data?.average || 0,
        rideStats: rides?.data?.timeline || [],
        driverStats: driverRatings?.data?.distribution || [],
        userActivities: this.transformToUserActivities(activeUsers?.data?.timeline || []),
        revenueData: this.transformToRevenueData(earnings?.data?.timeline || []),
        completionRate: rides?.data?.completionRate || 0,
        cancellationRate: rides?.data?.cancellationRate || 0,
        riderToDriverRatio: riderRatio?.data?.ratio || 0,
        averageRideDistance: rideDistance?.data?.average || 0,
        averageRideDuration: rideDuration?.data?.average || 0,
        driverUtilization: driverUtilization?.data?.rate || 0,
        driverEarnings: earnings?.data?.total || 0,
        growthRate: growthRate?.data?.rate || 0,
        peakHours: peakHours?.data?.hours || [],
        popularRoutes: popularRoutes?.data?.routes || [],
        userGrowth: this.transformToUserGrowth(growthRate?.data?.timeline || []),
        customerSatisfaction: satisfaction?.data?.metrics || []
      };
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      throw error;
    }
  }

  // Helper methods to transform data
  private transformToUserActivities(timeline: Array<{ date: string; count: number }>) {
    return timeline.map(item => ({
      hour: new Date(item.date).getHours(),
      active: item.count
    }));
  }

  private transformToRevenueData(timeline: Array<{ date: string; amount: number }>) {
    return timeline.map(item => ({
      date: item.date,
      amount: item.amount,
      type: 'revenue'
    }));
  }

  private transformToUserGrowth(timeline: Array<{ date: string; rate: number }>) {
    return timeline.map(item => ({
      date: item.date,
      users: Math.round(100 * (1 + item.rate)),
      drivers: Math.round(80 * (1 + item.rate)) 
    }));
  }

  // API methods
  private async getActiveUsers(timeRange: string): Promise<AxiosResponse<ApiResponse<ActiveUsersResponse>>> {
    return axios.get(`${BASE_URL}/analytics/active-users?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getRegisteredUsers(timeRange: string): Promise<AxiosResponse<ApiResponse<RegisteredUsersResponse>>> {
    return axios.get(`${BASE_URL}/analytics/registered-users?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getRides(timeRange: string): Promise<AxiosResponse<ApiResponse<RidesResponse>>> {
    return axios.get(`${BASE_URL}/analytics/rides?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getDriverRatings(timeRange: string): Promise<AxiosResponse<ApiResponse<DriverRatingsResponse>>> {
    return axios.get(`${BASE_URL}/analytics/driver/ratings?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getAverageRideDistance(timeRange: string): Promise<AxiosResponse<ApiResponse<RideMetricsResponse>>> {
    return axios.get(`${BASE_URL}/analytics/average-ride-distance?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getAverageRideDuration(timeRange: string): Promise<AxiosResponse<ApiResponse<RideMetricsResponse>>> {
    return axios.get(`${BASE_URL}/analytics/average-ride-duration?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getDriverUtilizationRate(timeRange: string): Promise<AxiosResponse<ApiResponse<DriverUtilizationResponse>>> {
    return axios.get(`${BASE_URL}/analytics/driver-utilization-rate?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getRiderToDriverRatio(timeRange: string): Promise<AxiosResponse<ApiResponse<RatioResponse>>> {
    return axios.get(`${BASE_URL}/analytics/rider-to-driver-ratio?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getDriverEarnings(timeRange: string): Promise<AxiosResponse<ApiResponse<EarningsResponse>>> {
    return axios.get(`${BASE_URL}/analytics/driver/earnings?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getGrowthRate(timeRange: string): Promise<AxiosResponse<ApiResponse<GrowthResponse>>> {
    return axios.get(`${BASE_URL}/analytics/growth-rate?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getPopularRoutes(timeRange: string): Promise<AxiosResponse<ApiResponse<PopularRoutesResponse>>> {
    return axios.get(`${BASE_URL}/analytics/popular-routes?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getPeakHours(timeRange: string): Promise<AxiosResponse<ApiResponse<PeakHoursResponse>>> {
    return axios.get(`${BASE_URL}/analytics/peak-hours?timeRange=${timeRange}`, createAxiosConfig());
  }

  private async getCustomerSatisfaction(timeRange: string): Promise<AxiosResponse<ApiResponse<CustomerSatisfactionResponse>>> {
    return axios.get(`${BASE_URL}/analytics/customer-satisfaction?timeRange=${timeRange}`, createAxiosConfig());
  }

  async exportData(format: 'csv' | 'pdf', timeRange: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `${BASE_URL}/analytics/export?format=${format}&timeRange=${timeRange}`,
        {
          ...createAxiosConfig(),
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}


