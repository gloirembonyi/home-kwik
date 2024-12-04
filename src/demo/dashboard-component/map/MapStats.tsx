// // components/map/MapStats.tsx

// import React from 'react';
// import { Users, Navigation, MapPin, Star } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/base/card';
// import { MapStats } from '../../types/map';

// interface MapStatsProps {
//   stats: MapStats;
//   loading?: boolean;
// }

// const MapStatsComponent: React.FC<MapStatsProps> = ({ stats, loading = false }) => {
//   const statCards = [
//     {
//       title: 'Active Drivers',
//       value: stats.activeDrivers,
//       icon: Users,
//       color: 'text-blue-500',
//       description: 'Currently on duty'
//     },
//     {
//       title: 'Busy Drivers',
//       value: stats.busyDrivers,
//       icon: Navigation,
//       color: 'text-yellow-500',
//       description: 'On active rides'
//     },
//     {
//       title: 'Available',
//       value: stats.availableDrivers,
//       icon: MapPin,
//       color: 'text-green-500',
//       description: 'Ready for rides'
//     },
//     {
//       title: 'Avg Rating',
//       value: stats.averageRating.toFixed(1),
//       icon: Star,
//       color: 'text-purple-500',
//       description: 'Driver rating'
//     }
//   ];

//   return (
//     <div className="grid gap-4 md:grid-cols-4">
//       {statCards.map((stat, index) => (
//         <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//             <stat.icon className={`h-4 w-4 ${stat.color}`} />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {loading ? '-' : stat.value}
//             </div>
//             <p className="text-xs text-muted-foreground">{stat.description}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default MapStatsComponent;