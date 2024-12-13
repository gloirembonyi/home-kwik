import React, { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import { Pagination } from "@/components/ui/base/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import { Input } from "@/components/ui/Input";
import { SearchIcon } from 'lucide-react';

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: Dispatch<SetStateAction<number>>;
  className?: string;
}

const AuditLogs = () => {
  // Initial data
  const initialData = [
    {
      id: 1,
      name: "Leasie Watson",
      date: "July 14, 2023",
      timestamp: "14:30:45",
      email: "leasie.w@demo.com",
      phone: "(250) 789-490-129",
      description: "User login",
      status: "Success"
    },
    {
      id: 2,
      name: "Floyd Miles",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "floyd.m@demo.com",
      phone: "(250) 789-490-129",
      description: "Password reset attempt",
      status: "Success"
    },
    {
      id: 3,
      name: "Theresa Webb",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "theresa.w@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Pending"
    },
    {
      id: 4,
      name: "Darlene Robertson",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "darlene.r@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Failed"
    },
    {
      id: 5,
      name: "Esther Howard",
      date: "July 14, 2023",
      timestamp: "July 14, 2023",
      email: "esther.h@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Pending"
    },
  ];

   // State management
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [selectedRows, setSelectedRows] = useState<number[]>([]);

   const [filters, setFilters] = useState({
     dateFrom: '',
     dateTo: '',
     status: '',
   });
 
   // Pagination settings
   const ITEMS_PER_PAGE = 10;
 
   // Advanced filtering
   const filteredData = useMemo(() => {
     return initialData.filter(item => {
       const matchesSearch = Object.values(item).some(value => 
         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
       );
 
       const matchesDateFrom = !filters.dateFrom || 
         new Date(item.date) >= new Date(filters.dateFrom);
       
       const matchesDateTo = !filters.dateTo || 
         new Date(item.date) <= new Date(filters.dateTo);
       
       const matchesStatus = !filters.status || 
         item.status.toLowerCase() === filters.status.toLowerCase();
 
       return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus;
     });
   }, [searchTerm, filters]);
 
   // Pagination
   const paginatedData = useMemo(() => {
     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
     return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
   }, [filteredData, currentPage]);
 
   // Row selection handlers
   const toggleRowSelection = useCallback((id: number) => {
    setSelectedRows((prev) =>
        prev.includes(id)
            ? prev.filter((selectedId) => selectedId !== id)
            : [...prev, id]
    );
}, []);

 
const toggleSelectAll = useCallback(() => {
  if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
  } else {
      setSelectedRows(paginatedData.map((item) => item.id));
  }
}, [selectedRows, paginatedData]);

   // Export handler
   const handleExport = useCallback(() => {
     const dataToExport = selectedRows.length > 0 
       ? initialData.filter(item => selectedRows.includes(item.id))
       : initialData;
 
     const csvContent = [
       "Name,Date,Timestamp,Email,Phone,Description,Status",
       ...dataToExport.map(item => 
         `${item.name},${item.date},${item.timestamp},${item.email},${item.phone},${item.description},${item.status}`
       )
     ].join("\n");
 
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement("a");
     const url = URL.createObjectURL(blob);
     link.setAttribute("href", url);
     link.setAttribute("download", "audit_logs_export.csv");
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   }, [selectedRows, initialData]);
 
   // Filter handlers
   const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
     const { name, value } = e.target;
     setFilters(prev => ({
       ...prev,
       [name]: value
     }));
   };
 
   const applyFilters = () => {
     setCurrentPage(1);
     setIsFilterOpen(false);
   };
 
   const clearFilters = () => {
     setFilters({
       dateFrom: '',
       dateTo: '',
       status: '',
     });
     setIsFilterOpen(false);
     setCurrentPage(1);
   };
 
   return (
     <div className=" space-y-6 bg-gray-50 min-h-screen">
       {/* Header with Search and Actions */}
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-semibold text-gray-800">Audit Logs</h1>
         <div className="flex items-center space-x-4">
            <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
           <Button 
             onClick={handleExport}
             disabled={selectedRows.length === 0}
             className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
           >
             Export {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
           </Button>
           <Button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-300"
           >
             Filter
           </Button>
         </div>
       </div>
 
       {/* Table */}
       <div className="overflow-x-auto border rounded-lg bg-white shadow">
         <Table className="w-full">
           <TableHeader>
             <TableRow className="bg-gray-100 text-gray-600">
               <TableCell className="w-12 text-center">
                 <Checkbox 
                   checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                   onCheckedChange={toggleSelectAll}
                 />
               </TableCell>
               <TableCell className="py-3 px-4 font-medium">User Name</TableCell>
               <TableCell className="py-3 px-4 font-medium">Applied Date</TableCell>
               <TableCell className="py-3 px-4 font-medium">Time Stamp</TableCell>
               <TableCell className="py-3 px-4 font-medium">Email Address</TableCell>
               <TableCell className="py-3 px-4 font-medium">Description</TableCell>
               <TableCell className="py-3 px-4 font-medium">Status</TableCell>
             </TableRow>
           </TableHeader>
           <TableBody>
             {paginatedData.map((item) => (
               <TableRow key={item.id} className="hover:bg-gray-50">
                 <TableCell className="text-center">
                   <Checkbox 
                     checked={selectedRows.includes(item.id)}
                     onCheckedChange={() => toggleRowSelection(item.id)}
                   />
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-800">
                   {item.name}
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-600">
                   {item.date}
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-600">
                   {item.timestamp}
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-600">
                   {item.email}
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-600">
                   {item.description}
                 </TableCell>
                 <TableCell className="py-3 px-4 text-gray-600">
                   <span className={`px-2 py-1 rounded-full text-xs ${
                     item.status === 'Success' 
                       ? 'bg-green-100 text-green-800' 
                       : item.status === 'Pending'
                       ? 'bg-yellow-100 text-yellow-800'
                       : 'bg-red-100 text-red-800'
                   }`}>
                     {item.status}
                   </span>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
           <TableCaption className="py-2 px-4 text-sm text-gray-500">
             Showing {paginatedData.length} of {filteredData.length} records
           </TableCaption>
         </Table>
       </div>
 
       {/* Pagination */}
       <div className="flex justify-between items-center pt-4">
         <span className="text-sm text-gray-600">
           Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} records
         </span>
         <Pagination
           total={filteredData.length}
           perPage={ITEMS_PER_PAGE}
           currentPage={currentPage}
           onPageChange={setCurrentPage}
           className="mt-4"
         />
       </div>
 
       {/* Filter Modal */}
       {isFilterOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-6 rounded-lg shadow-xl w-96">
             <h2 className="text-xl font-semibold mb-4">Filters</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Date From</label>
                 <Input 
                   type="date"
                   name="dateFrom"
                   value={filters.dateFrom}
                   onChange={handleFilterChange}
                   className="mt-1 block w-full" id={''}                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700">Date To</label>
                 <Input 
                   type="date"
                   name="dateTo"
                   value={filters.dateTo}
                   onChange={handleFilterChange}
                   className="mt-1 block w-full" id={''}                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700">Status</label>
                 <select 
                   name="status"
                   value={filters.status}
                   onChange={handleFilterChange}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                 >
                   <option value="">All Statuses</option>
                   <option value="Success">Success</option>
                   <option value="Pending">Pending</option>
                   <option value="Failed">Failed</option>
                 </select>
               </div>
             </div>
             <div className="flex justify-end space-x-2 mt-6">
               <Button 
                 onClick={clearFilters}
                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
               >
                 Clear
               </Button>
               <Button 
                 onClick={applyFilters}
                 className="bg-blue-600 text-white px-4 py-2 rounded-md"
               >
                 Apply
               </Button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default AuditLogs;
 