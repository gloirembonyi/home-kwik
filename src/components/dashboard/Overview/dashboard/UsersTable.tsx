// // components/dashboard/UsersTable.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/base/card";

// export const UsersTable = ({ users }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle className="text-lg font-semibold">Frequent Users</CardTitle>
//           </div>
//           <button className="text-blue-600 hover:underline">View All</button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <table className="w-full">
//           <thead>
//             <tr className="text-left text-gray-500">
//               <th className="py-3 px-4">User Name</th>
//               <th className="py-3 px-4">Preferred Role</th>
//               <th className="py-3 px-4">Gender</th>
//               <th className="py-3 px-4">Rides</th>
//               <th className="py-3 px-4">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={index} className="border-t border-gray-100">
//                 <td className="py-4 px-4">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src="/api/placeholder/40/40"
//                       alt={user.name}
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <span className="font-medium">{user.name}</span>
//                   </div>
//                 </td>
//                 <td className="py-4 px-4 text-gray-600">{user.role}</td>
//                 <td className="py-4 px-4 text-gray-600">{user.gender}</td>
//                 <td className="py-4 px-4 text-gray-600">{user.rides}</td>
//                 <td className="py-4 px-4">
//                   <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
//                     {user.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </CardContent>
//     </Card>
//   );
// };