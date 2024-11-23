// import { AnalyticsService } from "@/services/apiService";

// // services/api/MobileDataService.ts
// export interface MobileAppData {
//     rides: RideData[];
//     users: UserData[];
//     metrics: AppMetrics;
//   }
  
//   export class MobileDataService {
//     private static API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  
//     // Fetch all mobile app data
//     static async fetchMobileAppData(): Promise<MobileAppData> {
//       try {
//         const [rides, users, metrics] = await Promise.all([
//           this.fetchRides(),
//           this.fetchUsers(),
//           this.fetchMetrics()
//         ]);
  
//         return { rides, users, metrics };
//       } catch (error) {
//         AnalyticsService.trackError(error as Error, {
//           context: 'mobile_data_fetch'
//         });
//         throw error;
//       }
//     }
  
//     // Fetch ride data
//     static async fetchRides(): Promise<RideData[]> {
//       const response = await fetch(`${this.API_BASE}/api/rides`);
//       if (!response.ok) throw new Error('Failed to fetch ride data');
//       return response.json();
//     }
  
//     // Fetch user data
//     static async fetchUsers(): Promise<UserData[]> {
//       const response = await fetch(`${this.API_BASE}/api/users`);
//       if (!response.ok) throw new Error('Failed to fetch user data');
//       return response.json();
//     }
  
//     // Fetch app metrics
//     static async fetchMetrics(): Promise<AppMetrics> {
//       const response = await fetch(`${this.API_BASE}/api/metrics`);
//       if (!response.ok) throw new Error('Failed to fetch metrics');
//       return response.json();
//     }
//   }