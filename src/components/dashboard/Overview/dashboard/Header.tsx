// // components/dashboard/Header.tsx
// import { Bell, Search, ChevronDown } from "lucide-react";

// export const DashboardHeader = ({ searchQuery, setSearchQuery }) => {
//   return (
//     <header className="flex justify-between items-center mb-8">
//       <div>
//         <h1 className="text-2xl font-semibold flex items-center gap-2">
//           Hello Robert 👋
//         </h1>
//         <p className="text-gray-500">Good Morning</p>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="relative">
//           <Bell className="w-6 h-6 text-gray-600" />
//           <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
//             3
//           </div>
//         </div>

//         <div className="flex items-center gap-2 bg-white p-1 rounded-lg">
//           <img src="/api/placeholder/40/40" alt="User" className="w-10 h-10 rounded-lg" />
//           <div>
//             <p className="font-medium">Robert Allen</p>
//             <p className="text-sm text-gray-500">Super Admin</p>
//           </div>
//           <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
//         </div>
//       </div>
//     </header>
//   );
// };