// // components/dashboard/StatsCard.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// export const StatsCard = ({ title, value, change, lastUpdate, icon }) => {
//   const isPositive = change > 0;
  
//   return (
//     <Card className="bg-white">
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium text-gray-500">
//           {title}
//         </CardTitle>
//         <div className="p-2 bg-gray-100 rounded-lg">
//           {icon}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-1">
//           <div className="text-2xl font-bold">{value}</div>
//           {change && (
//             <div className="flex items-center gap-1">
//               <span className={`flex items-center text-sm ${
//                 isPositive ? "text-green-500" : "text-red-500"
//               }`}>
//                 {isPositive ? (
//                   <ArrowUpRight className="w-4 h-4" />
//                 ) : (
//                   <ArrowDownRight className="w-4 h-4" />
//                 )}
//                 {Math.abs(change)}%
//               </span>
//             </div>
//           )}
//           <div className="text-sm text-gray-500">
//             Last Update: {lastUpdate}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };