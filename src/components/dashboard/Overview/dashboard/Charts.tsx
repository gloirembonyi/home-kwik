// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';

// const ridesData = [
//   { day: 'Mon', completed: 60, inProgress: 25, pending: 15 },
//   { day: 'Tue', completed: 58, inProgress: 22, pending: 20 },
//   { day: 'Wed', completed: 45, inProgress: 25, pending: 30 },
//   { day: 'Thu', completed: 60, inProgress: 30, pending: 10 },
//   { day: 'Fri', completed: 75, inProgress: 15, pending: 10 },
//   { day: 'Sat', completed: 45, inProgress: 30, pending: 25 },
//   { day: 'Sun', completed: 48, inProgress: 32, pending: 20 },
// ];

// const roleData = [
//   { name: 'Drivers', value: 63, color: '#1D3B8A' },
//   { name: 'Riders', value: 25, color: '#7DD3FC' },
// ];

// export const RidesChart = () => {
//   return (
//     <div className="w-full bg-white rounded-xl p-6 shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">Rides Overview</h2>
//         <div className="relative">
//           <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm appearance-none pr-8">
//             <option>Today</option>
//             <option>Weekly</option>
//             <option>Monthly</option>
//           </select>
//         </div>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={ridesData}
//             margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
//             barSize={20}
//           >
//             <XAxis 
//               dataKey="day" 
//               axisLine={false} 
//               tickLine={false}
//               tick={{ fill: '#6B7280', fontSize: 12 }}
//             />
//             <YAxis 
//               axisLine={false} 
//               tickLine={false}
//               tick={{ fill: '#6B7280', fontSize: 12 }}
//               ticks={[0, 20, 40, 60, 80, 100]}
//             />
//             <Tooltip 
//               cursor={{ fill: 'transparent' }}
//               contentStyle={{ 
//                 backgroundColor: 'white',
//                 border: '1px solid #E5E7EB',
//                 borderRadius: '8px',
//                 padding: '8px'
//               }}
//             />
//             <Bar 
//               dataKey="completed" 
//               fill="#1D3B8A" 
//               stackId="stack"
//               radius={[0, 0, 0, 0]}
//             />
//             <Bar 
//               dataKey="inProgress" 
//               fill="#FFB020" 
//               stackId="stack"
//               radius={[0, 0, 0, 0]}
//             />
//             <Bar 
//               dataKey="pending" 
//               fill="#F04438" 
//               stackId="stack"
//               radius={[0, 0, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export const RoleDistributionChart = () => {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold text-gray-800">Role Usage</h2>
//         <div className="relative">
//           <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm appearance-none pr-8">
//             <option>Monthly</option>
//             <option>Weekly</option>
//             <option>Daily</option>
//           </select>
//         </div>
//       </div>
//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={roleData}
//               innerRadius={60}
//               outerRadius={80}
//               paddingAngle={0}
//               dataKey="value"
//               startAngle={90}
//               endAngle={-270}
//             >
//               {roleData.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={entry.color} 
//                   cornerRadius={0}
//                 />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//       <div className="flex justify-center gap-8 mt-6">
//         {roleData.map((entry) => (
//           <div key={entry.name} className="text-center">
//             <p className="text-2xl font-semibold mb-1" style={{ color: entry.color }}>
//               {entry.value}%
//             </p>
//             <p className="text-gray-500 text-sm">{entry.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };