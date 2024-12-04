// import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
// import { retry } from 'axios-retry';

// const BASE_URL = 'https://kwik-ride-backend.onrender.com/api/v1/docs#/';

// // Constants for configuration
// const CONFIG = {
//   REQUEST_TIMEOUT: 30000, // 30 seconds
//   RETRY_ATTEMPTS: 3,
//   RETRY_DELAY: 1000, // 1 second
//   CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
// } as const;

// // Cache implementation
// class SimpleCache<T> {
//   private cache: Map<string, { data: T; timestamp: number }> = new Map();

//   set(key: string, data: T): void {
//     this.cache.set(key, { data, timestamp: Date.now() });
//   }

//   get(key: string): T | null {
//     const item = this.cache.get(key);
//     if (!item) return null;
//     if (Date.now() - item.timestamp > CONFIG.CACHE_DURATION) {
//       this.cache.delete(key);
//       return null;
//     }
//     return item.data;
//   }

//   clear(): void {
//     this.cache.clear();
//   }
// }

// // Keep all the existing interfaces...
// // [Previous interface definitions remain unchanged]

// export class AnalyticsApiService {
//   private static instance: AnalyticsApiService;
//   private cache: SimpleCache<any>;
//   private axiosInstance;

//   private constructor() {
//     this.cache = new SimpleCache();
//     this.axiosInstance = axios.create({
//       baseURL: BASE_URL,
//       timeout: CONFIG.REQUEST_TIMEOUT,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Configure retry behavior
//     retry(this.axiosInstance, {
//       retries: CONFIG.RETRY_ATTEMPTS,
//       retryDelay: (retryCount) => {
//         return retryCount * CONFIG.RETRY_DELAY;
//       },
//       retryCondition: (error: AxiosError) => {
//         return (
//           axios.isAxiosError(error) &&
//           (!error.response || (error.response.status >= 500 && error.response.status <= 599))
//         );
//       },
//     });

//     this.setupInterceptors();
//   }

//   private setupInterceptors(): void {
//     this.axiosInstance.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     this.axiosInstance.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError) => {
//         if (error.response?.status === 401) {
//           this.handleUnauthorized();
//         }
//         return Promise.reject(this.enhanceError(error));
//       }
//     );
//   }

//   private handleUnauthorized(): void {
//     localStorage.removeItem('token');
//     this.cache.clear();
//     window.location.href = '/login';
//   }

//   private enhanceError(error: AxiosError): Error {
//     const enhancedError = new Error(
//       `API Error: ${error.message} (${error.response?.status || 'Unknown'})`
//     );
//     enhancedError.cause = error;
//     return enhancedError;
//   }

//   static getInstance(): AnalyticsApiService {
//     if (!AnalyticsApiService.instance) {
//       AnalyticsApiService.instance = new AnalyticsApiService();
//     }
//     return AnalyticsApiService.instance;
//   }

//   private getCacheKey(endpoint: string, timeRange: string): string {
//     return `${endpoint}_${timeRange}`;
//   }

//   private async makeRequest<T>(
//     endpoint: string,
//     timeRange: string,
//     config?: AxiosRequestConfig
//   ): Promise<AxiosResponse<ApiResponse<T>>> {
//     const cacheKey = this.getCacheKey(endpoint, timeRange);
//     const cachedData = this.cache.get(cacheKey);
    
//     if (cachedData) {
//       return cachedData;
//     }

//     try {
//       const response = await this.axiosInstance.get(
//         `${endpoint}?timeRange=${timeRange}`,
//         config
//       );
//       this.cache.set(cacheKey, response);
//       return response;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         throw this.enhanceError(error);
//       }
//       throw error;
//     }
//   }

//   async fetchDashboardData(timeRange: string) {
//     try {
//       const requests = [
//         this.getActiveUsers(timeRange),
//         this.getRegisteredUsers(timeRange),
//         this.getRides(timeRange),
//         this.getDriverRatings(timeRange),
//         this.getAverageRideDistance(timeRange),
//         this.getAverageRideDuration(timeRange),
//         this.getDriverUtilizationRate(timeRange),
//         this.getRiderToDriverRatio(timeRange),
//         this.getDriverEarnings(timeRange),
//         this.getGrowthRate(timeRange),
//         this.getPopularRoutes(timeRange),
//         this.getPeakHours(timeRange),
//         this.getCustomerSatisfaction(timeRange)
//       ];

//       const results = await Promise.allSettled(requests);
      
//       const getData = (result: PromiseSettledResult<any>) => 
//         result.status === 'fulfilled' ? result.value?.data : null;

//       const [
//         activeUsers,
//         registeredUsers,
//         rides,
//         driverRatings,
//         rideDistance,
//         rideDuration,
//         driverUtilization,
//         riderRatio,
//         earnings,
//         growthRate,
//         popularRoutes,
//         peakHours,
//         satisfaction
//       ] = results.map(getData);

//       return {
//         activeUsers: activeUsers?.count || 0,
//         registeredUsers: registeredUsers?.count || 0,
//         totalRides: rides?.total || 0,
//         averageRating: driverRatings?.average || 0,
//         rideStats: rides?.timeline || [],
//         driverStats: driverRatings?.distribution || [],
//         userActivities: this.transformToUserActivities(activeUsers?.timeline || []),
//         revenueData: this.transformToRevenueData(earnings?.timeline || []),
//         completionRate: rides?.completionRate || 0,
//         cancellationRate: rides?.cancellationRate || 0,
//         riderToDriverRatio: riderRatio?.ratio || 0,
//         averageRideDistance: rideDistance?.average || 0,
//         averageRideDuration: rideDuration?.average || 0,
//         driverUtilization: driverUtilization?.rate || 0,
//         driverEarnings: earnings?.total || 0,
//         growthRate: growthRate?.rate || 0,
//         peakHours: peakHours?.hours || [],
//         popularRoutes: popularRoutes?.routes || [],
//         userGrowth: this.transformToUserGrowth(growthRate?.timeline || []),
//         customerSatisfaction: satisfaction?.metrics || []
//       };
//     } catch (error) {
//       console.error('Dashboard data fetch error:', error);
//       throw error;
//     }
//   }

//   // Transform methods remain the same...
//   private transformToUserActivities(timeline: Array<{ date: string; count: number }>) {
//     return timeline.map(item => ({
//       hour: new Date(item.date).getHours(),
//       active: item.count
//     }));
//   }

//   private transformToRevenueData(timeline: Array<{ date: string; amount: number }>) {
//     return timeline.map(item => ({
//       date: item.date,
//       amount: item.amount,
//       type: 'revenue'
//     }));
//   }

//   private transformToUserGrowth(timeline: Array<{ date: string; rate: number }>) {
//     return timeline.map(item => ({
//       date: item.date,
//       users: Math.round(100 * (1 + item.rate)),
//       drivers: Math.round(80 * (1 + item.rate)) 
//     }));
//   }

//   // API methods now use the makeRequest helper
//   private getActiveUsers(timeRange: string) {
//     return this.makeRequest<ActiveUsersResponse>('/analytics/active-users', timeRange);
//   }

//   private getRegisteredUsers(timeRange: string) {
//     return this.makeRequest<RegisteredUsersResponse>('/analytics/registered-users', timeRange);
//   }

//   /private async getRides(timeRange: string): Promise<AxiosResponse<ApiResponse<RidesResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/rides?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getDriverRatings(timeRange: string): Promise<AxiosResponse<ApiResponse<DriverRatingsResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/driver/ratings?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getAverageRideDistance(timeRange: string): Promise<AxiosResponse<ApiResponse<RideMetricsResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/average-ride-distance?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getAverageRideDuration(timeRange: string): Promise<AxiosResponse<ApiResponse<RideMetricsResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/average-ride-duration?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getDriverUtilizationRate(timeRange: string): Promise<AxiosResponse<ApiResponse<DriverUtilizationResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/driver-utilization-rate?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getRiderToDriverRatio(timeRange: string): Promise<AxiosResponse<ApiResponse<RatioResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/rider-to-driver-ratio?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getDriverEarnings(timeRange: string): Promise<AxiosResponse<ApiResponse<EarningsResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/driver/earnings?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getGrowthRate(timeRange: string): Promise<AxiosResponse<ApiResponse<GrowthResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/growth-rate?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getPopularRoutes(timeRange: string): Promise<AxiosResponse<ApiResponse<PopularRoutesResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/popular-routes?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getPeakHours(timeRange: string): Promise<AxiosResponse<ApiResponse<PeakHoursResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/peak-hours?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   private async getCustomerSatisfaction(timeRange: string): Promise<AxiosResponse<ApiResponse<CustomerSatisfactionResponse>>> {
//     return axios.get(`${BASE_URL}/analytics/customer-satisfaction?timeRange=${timeRange}`, createAxiosConfig());
//   }

//   async exportData(format: 'csv' | 'pdf', timeRange: string): Promise<Blob> {
//     try {
//       const response = await this.axiosInstance.get(
//         `/analytics/export?format=${format}&timeRange=${timeRange}`,
//         {
//           responseType: 'blob',
//           timeout: CONFIG.REQUEST_TIMEOUT * 2 // Double timeout for exports
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting data:', error);
//       throw error;
//     }
//   }
// }