// types.ts
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface ActiveUsersResponse {
    count: number;
    timeline: Array<{
      date: string;
      count: number;
    }>;
  }
  
  export interface RegisteredUsersResponse {
    count: number;
  }
  
  export interface RidesResponse {
    total: number;
    timeline: Array<any>;
    completionRate: number;
    cancellationRate: number;
  }
  
  export interface DriverRatingsResponse {
    average: number;
    distribution: Array<any>;
  }
  
  export interface RideMetricsResponse {
    average: number;
  }
  
  export interface DriverUtilizationResponse {
    rate: number;
  }
  
  export interface RatioResponse {
    ratio: number;
  }
  
  export interface EarningsResponse {
    total: number;
    timeline: Array<{
      date: string;
      amount: number;
    }>;
  }
  
  export interface GrowthResponse {
    rate: number;
    timeline: Array<{
      date: string;
      rate: number;
    }>;
  }
  
  export interface PopularRoutesResponse {
    routes: Array<any>;
  }
  
  export interface PeakHoursResponse {
    hours: Array<any>;
  }
  
  export interface CustomerSatisfactionResponse {
    metrics: Array<any>;
  }