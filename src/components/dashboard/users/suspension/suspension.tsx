import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  FilterIcon, 
  ChevronDownIcon, 
  ImportIcon, 
  SearchIcon, 
  UserIcon 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/base/dropdown-menu";

interface UserAvatarProps {
  name: string;
  image: string | null;
}

const SuspensionHistory = () => {
  // Initial state with more sample data
  const [suspensions, setSuspensions] = useState([
    {
      id: 1,
      name: "Leasie Watson",
      date: "July 14, 2023",
      email: "leasie.w@demo.com",
      phone: "(250) 789-4901",
      reason: "User identity fraud",
      status: "Unsuspended",
      image: null, // Test null image scenario
    },
    {
      id: 2,
      name: "Floyd Miles",
      date: "July 14, 2023",
      email: "floyd.m@demo.com",
      phone: "(250) 789-4902",
      reason: "False documentation",
      status: "Suspended",
      image: null,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      date: "August 5, 2023",
      email: "sarah.j@demo.com",
      phone: "(250) 789-4903",
      reason: "Violation of terms of service",
      status: "Suspended",
      image: null,
    },
    {
      id: 4,
      name: "Michael Chen",
      date: "June 22, 2023",
      email: "michael.c@demo.com",
      phone: "(250) 789-4904",
      reason: "Suspicious activity",
      status: "Unsuspended",
      image: null,
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      date: "September 10, 2023",
      email: "emma.r@demo.com",
      phone: "(250) 789-4905",
      reason: "Payment fraud",
      status: "Suspended",
      image: null,
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtering and search logic
  const filteredSuspensions = useMemo(() => {
    return suspensions.filter(suspension => 
      (statusFilter === "All" || suspension.status === statusFilter) &&
      (searchTerm === "" || 
        suspension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suspension.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suspension.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [suspensions, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedSuspensions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSuspensions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSuspensions, currentPage]);

  // Avatar Component
  const UserAvatar: React.FC<UserAvatarProps> = ({ name, image }) => {
    if (image) {
      return (
        <Image
          src={image}
          alt={`${name}'s profile`}
          width={32}
          height={32}
          className="rounded-full object-cover w-8 h-8"
        />
      );
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  // Toggle item selection
  const toggleItemSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  

  // Select all items
  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === paginatedSuspensions.length 
        ? [] 
        : paginatedSuspensions.map(item => item.id)
    );
  };

  // Export functionality (mock)
  const handleExport = () => {
    const dataToExport = selectedItems.length > 0 
      ? suspensions.filter(item => selectedItems.includes(item.id))
      : suspensions;
    
    const csvContent = dataToExport.map(item => 
      `${item.name},${item.email},${item.phone},${item.reason},${item.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "suspension_history.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredSuspensions.length / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Suspension History</h1>
            <p className="text-sm text-gray-500">All suspended users in the system</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 shadow"
            >
              <ImportIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {/* Dropdown Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-300 shadow">
                  <FilterIcon className="w-4 h-4" />
                  <span>{statusFilter}</span>
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem 
                  onClick={() => setStatusFilter("All")}
                  className={statusFilter === "All" ? "bg-blue-50" : ""}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter("Suspended")}
                  className={statusFilter === "Suspended" ? "bg-blue-50" : ""}
                >
                  Suspended
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter("Unsuspended")}
                  className={statusFilter === "Unsuspended" ? "bg-blue-50" : ""}
                >
                  Unsuspended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-sm text-gray-600">
                <th className="p-4 text-center font-medium">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === paginatedSuspensions.length && paginatedSuspensions.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500" 
                  />
                </th>
                <th className="p-4 text-left font-medium">User Name</th>
                <th className="p-4 text-left font-medium">Suspense Date</th>
                <th className="p-4 text-left font-medium">Email Address</th>
                <th className="p-4 text-left font-medium">Mobile Number</th>
                <th className="p-4 text-left font-medium">Issue/Reason</th>
                <th className="p-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuspensions.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 border-b">
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(record.id)}
                      onChange={() => toggleItemSelection(record.id)}
                      className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                  <UserAvatar name={record.name} image={record.image} />
                    <span className="text-sm font-medium text-gray-700">{record.name}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{record.date}</td>
                  <td className="p-4 text-sm text-gray-600">{record.email}</td>
                  <td className="p-4 text-sm text-gray-600">{record.phone}</td>
                  <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{record.reason}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide inline-block ${
                        record.status === "Suspended"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {record.status}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSuspensions.length)} 
            {" "}out of {filteredSuspensions.length} records
          </p>
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 text-sm border rounded-md 
                  ${currentPage === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensionHistory;