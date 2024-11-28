// import React, { useState } from 'react';
// import { 
//   Truck, 
//   MapPin, 
//   Star, 
//   Clock, 
//   Navigation, 
//   Check, 
//   RefreshCw 
// } from 'lucide-react';

// // Mock data - in a real application, this would come from an API
// const VEHICLES = [
//   {
//     id: 'DR-653CD3',
//     location: 'Kigali, Rwanda',
//     status: 'Active',
//     rating: 2.5,
//     timeline: [
//       { stage: 'Pickup', time: 'Sep 01, 7:53 AM' },
//       { stage: 'Ongoing Trip', time: 'Sep 01, 8:02 AM' },
//       { stage: 'Arrived', time: 'Sep 01, 8:18 AM' }
//     ]
//   },
//   {
//     id: 'DR-653CD4',
//     location: 'Kigali, Rwanda',
//     status: 'Idle',
//     rating: 4.2,
//   },
//   {
//     id: 'DR-653CD5',
//     location: 'Kigali, Rwanda',
//     status: 'Maintenance',
//     rating: 3.8,
//   },
//   {
//     id: 'DR-653CD6',
//     location: 'Kigali, Rwanda',
//     status: 'En Route',
//     rating: 4.5,
//   }
// ];

// // Status color mapping
// const STATUS_COLORS = {
//   'Active': 'bg-green-500',
//   'Idle': 'bg-yellow-500',
//   'Maintenance': 'bg-red-500',
//   'En Route': 'bg-blue-500'
// };

// const FleetPage: React.FC = () => {
//   const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
//   const [mapLocation, setMapLocation] = useState(
//     'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24176.01944482793!2d-74.0033343!3d40.7430584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1637026261836!5m2!1sen!2sus'
//   );

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-1/3 bg-white shadow-lg overflow-y-auto">
//         <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-3xl font-extrabold text-gray-800">Fleet Management</h1>
//             <RefreshCw className="text-gray-500 hover:text-blue-600 cursor-pointer" />
//           </div>
//         </div>

//         {/* Active Vehicle Section */}
//         <div className="p-6">
//           <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//             {/* Selected Vehicle Header */}
//             <div className="bg-gray-50 p-4 flex justify-between items-center">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-100 p-3 rounded-full">
//                   <Truck className="text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">{selectedVehicle.id}</h2>
//                   <div className="flex items-center space-x-2">
//                     <MapPin className="w-4 h-4 text-gray-500" />
//                     <p className="text-sm text-gray-600">{selectedVehicle.location}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className={`px-3 py-1 rounded-full text-white text-xs font-medium ${STATUS_COLORS[selectedVehicle.status]}`}
//               >
//                 {selectedVehicle.status}
//               </div>
//             </div>

//             {/* Vehicle Rating */}
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex justify-between items-center mb-2">
//                 <div className="flex items-center">
//                   <Star className="w-5 h-5 text-yellow-500 mr-2" />
//                   <p className="text-sm font-medium text-gray-700">Vehicle Rating</p>
//                 </div>
//                 <p className="text-sm font-bold text-gray-800">{selectedVehicle.rating}/5</p>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div 
//                   className="bg-yellow-400 h-2.5 rounded-full" 
//                   style={{ width: `${(selectedVehicle.rating / 5) * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Timeline */}
//             {selectedVehicle.timeline && (
//               <div className="p-4">
//                 <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
//                   <Clock className="w-4 h-4 mr-2 text-gray-500" />
//                   Trip Timeline
//                 </h3>
//                 <div className="space-y-3">
//                   {selectedVehicle.timeline.map((event, index) => (
//                     <div key={index} className="flex items-center">
//                       <div className="w-6 h-6 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
//                         <Check className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-800">{event.stage}</p>
//                         <p className="text-xs text-gray-500">{event.time}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Other Vehicles List */}
//           <div className="mt-6 space-y-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Other Vehicles</h3>
//             {VEHICLES.filter(v => v.id !== selectedVehicle.id).map((vehicle) => (
//               <div 
//                 key={vehicle.id} 
//                 className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
//                 onClick={() => setSelectedVehicle(vehicle)}
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="bg-blue-100 p-2.5 rounded-full">
//                     <Truck className="text-blue-600 w-5 h-5" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-800">{vehicle.id}</h4>
//                     <p className="text-sm text-gray-500">{vehicle.location}</p>
//                   </div>
//                 </div>
//                 <div 
//                   className={`px-2.5 py-1 rounded-full text-white text-xs font-medium ${STATUS_COLORS[vehicle.status]}`}
//                 >
//                   {vehicle.status}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>

//       {/* Map Section */}
//       <main className="flex-1 relative">
//         <div className="absolute inset-0">
//           <iframe
//             title="Vehicle Location"
//             className="w-full h-full"
//             src={mapLocation}
//             allowFullScreen
//             loading="lazy"
//           ></iframe>
//           <div className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-2">
//             <Navigation className="w-6 h-6 text-blue-600" />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FleetPage;

