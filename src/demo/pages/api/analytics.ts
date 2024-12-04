// // pages/api/analytics.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { AnalyticsData } from '@/types/dashboard';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<AnalyticsData[] | { error: string }>
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const period = req.query.period as string || 'month';
//     const data = generateAnalyticsData(period);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch analytics data' });
//   }
// }

// function generateAnalyticsData(period: string): AnalyticsData[] {
//   const data: AnalyticsData[] = [];
//   const now = new Date();
//   const daysToGenerate = period === 'month' ? 30 : period === 'week' ? 7 : 1;

//   for (let i = daysToGenerate; i >= 0; i--) {
//     const date = new Date(now);
//     date.setDate(date.getDate() - i);
    
//     data.push({
//       date: date.toISOString().split('T')[0],
//       rides: Math.floor(Math.random() * 1000) + 500,
//       revenue: Math.floor(Math.random() * 10000) + 5000,
//       users: Math.floor(Math.random() * 500) + 200,
//       satisfaction: Math.random() * 2 + 3, // 3-5 rating
//       cancelRate: Math.random() * 10, // 0-10%
//       avgDuration: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
//       peakHours: Array.from({ length: 24 }, (_, hour) => ({
//         hour,
//         rides: Math.floor(Math.random() * 100) + 20
//       }))
//     });
//   }

//   return data;
// }