import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  Filter,
  Download,
  Eye,
  Trash2,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/base/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/base/pagination";
import RideDetails from "./details-model";

interface Ride {
  id: string;
  pickup: string;
  destination: string;
  driver: string;
  date: string;
  status: string;
  fare: string;
}

interface DeleteConfirmationModalProps {
  ride: Ride;
  onConfirm: () => void;
  onCancel: () => void;
}

// Mock data generation function
const generateMockRides = () => {
  const statuses = ["Successful", "Cancelled", "Pending", "In Progress"];
  const locations = [
    "Kimihurura",
    "Rebero",
    "Kigali City Center",
    "Nyarutarama",
    "Gacuriro",
    "Kisimenti",
    "Kagugu",
    "Remera",
  ];
  const drivers = [
    "Adeline KARAKE",
    "Jean MUTABAZI",
    "Marie UWIMANA",
    "Claude NDAYISHIMIYE",
    "Patrick NIYONZIMA",
  ];

  return Array.from({ length: 60 }, (_, index) => ({
    id: `R${String(10000 + index)}`,
    pickup: locations[Math.floor(Math.random() * locations.length)],
    destination: locations[Math.floor(Math.random() * locations.length)],
    driver: drivers[Math.floor(Math.random() * drivers.length)],
    date: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString("en-GB"),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    fare: (Math.random() * 5000 + 1000).toFixed(2),
  }));
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  ride,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={24} />
            Confirm Deletion
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete ride {ride.id}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ridesPerPage, setRidesPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [rides, setRides] = useState(generateMockRides());
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [rideToDelete, setRideToDelete] = useState<Ride | null>(null);

  // Filtering and Pagination logic
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const matchesSearch =
        ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || ride.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [rides, searchTerm, filterStatus]);

  const paginatedRides = useMemo(() => {
    const startIndex = (currentPage - 1) * ridesPerPage;
    return filteredRides.slice(startIndex, startIndex + ridesPerPage);
  }, [filteredRides, currentPage, ridesPerPage]);

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      "Ride ID,Pickup,Destination,Driver,Date,Status,Fare",
      ...filteredRides.map(
        (ride) =>
          `${ride.id},${ride.pickup},${ride.destination},${ride.driver},${ride.date},${ride.status},${ride.fare}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ride_history_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete ride functionality
  const handleDeleteRide = () => {
    if (rideToDelete) {
      setRides((prevRides) =>
        prevRides.filter((ride) => ride.id !== rideToDelete.id)
      );

      // Reset pagination if current page becomes empty
      if (filteredRides.length - 1 <= (currentPage - 1) * ridesPerPage) {
        setCurrentPage(Math.max(1, currentPage - 1));
      }

      // Reset delete state
      setRideToDelete(null);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Ride Details Modal */}
      {selectedRide && (
        <RideDetails
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {rideToDelete && (
        <DeleteConfirmationModal
          ride={rideToDelete}
          onConfirm={handleDeleteRide}
          onCancel={() => setRideToDelete(null)}
        />
      )}

      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Ride History</h1>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search ride..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-1 border-2 border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Search className="absolute left-4 top-2 text-gray-400" />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} />
                    Status: {filterStatus}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {[
                    "All",
                    "Successful",
                    "Cancelled",
                    "Pending",
                    "In Progress",
                  ].map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onSelect={() => setFilterStatus(status)}
                      className="cursor-pointer"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ride ID</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Fare (RWF)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="font-medium">{ride.id}</TableCell>
                  <TableCell>{ride.pickup}</TableCell>
                  <TableCell>{ride.destination}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.date}</TableCell>
                  <TableCell>{ride.fare}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        ride.status
                      )}`}
                    >
                      {ride.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedRide(ride)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setRideToDelete(ride)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination and Page Size Selection */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={ridesPerPage.toString()}
                onValueChange={(value) => setRidesPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {`${(currentPage - 1) * ridesPerPage + 1}-${Math.min(
                  currentPage * ridesPerPage,
                  filteredRides.length
                )} of ${filteredRides.length}`}
              </span>
              <nav>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage((prev) => prev - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {/* Generate page numbers */}
          
          
          
          
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          Math.ceil(filteredRides.length / ridesPerPage)
                        ),
                      },
                      (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          const maxPage = Math.ceil(
                            filteredRides.length / ridesPerPage
                          );
                          if (currentPage < maxPage) {
                            setCurrentPage((prev) => prev + 1);
                          }
                        }}
                        className={
                          currentPage ===
                          Math.ceil(filteredRides.length / ridesPerPage)
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
