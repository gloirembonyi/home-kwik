import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import {
  Download,
  FilterIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/base/pagination";
import { Button } from "@/components/ui/base/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { Calendar } from "@/components/ui/base/calendar";
import ExportFilterModal from "./ExportFilterModal";

// Define types
export interface RefundRequest {
  id: string;
  rideId: string;
  reason: string;
  rider: string;
  driver: string;
  date: string;
  status: RefundStatus;
  amount: number;
}

// Define status as a union type
export type RefundStatus = "Pending" | "Approved" | "Denied";

export interface FilterState {
  status: "All" | RefundStatus;
  dateRange: DateRange;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CalendarProps {
  mode: "range";
  selected: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}

// Mock data service (replace with actual API call in production)
const fetchRefundRequests = async () => {
  // Simulating an API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: "1",
      rideId: "345321231",
      reason: "Canceled ride",
      rider: "Aderline Karake",
      driver: "John Smith",
      date: "2024-02-12",
      status: "Pending" as RefundStatus,
      amount: 45.5,
    },
    {
      id: "2",
      rideId: "345321232",
      reason: "Overcharged",
      rider: "Michael Johnson",
      driver: "Emily Davis",
      date: "2024-02-13",
      status: "Pending" as RefundStatus,
      amount: 62.75,
    },
    {
      id: "3",
      rideId: "345321233",
      reason: "Poor service",
      rider: "Sarah Williams",
      driver: "David Brown",
      date: "2024-02-14",
      status: "Approved" as RefundStatus,
      amount: 35.25,
    },
    {
      id: "4",
      rideId: "345321234",
      reason: "Wrong destination",
      rider: "Robert Lee",
      driver: "Jessica Garcia",
      date: "2024-02-15",
      status: "Denied" as RefundStatus,
      amount: 55.0,
    },
    {
      id: "5",
      rideId: "345321235",
      reason: "Late pickup",
      rider: "Emma Wilson",
      driver: "Carlos Rodriguez",
      date: "2024-02-16",
      status: "Pending" as RefundStatus,
      amount: 40.3,
    },
    {
      id: "6",
      rideId: "345321236",
      reason: "Driver rudeness",
      rider: "Olivia Martinez",
      driver: "Alex Johnson",
      date: "2024-02-17",
      status: "Pending" as RefundStatus,
      amount: 52.9,
    },
  ];
};

const RefundRequestsPage: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "All",
    dateRange: {
      from: null,
      to: null,
    },
  });

  // Fetch refund requests on component mount
  useEffect(() => {
    const loadRefundRequests = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRefundRequests();
        setRefundRequests(data);
      } catch (error) {
        console.error("Failed to fetch refund requests", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRefundRequests();
  }, []);

  // Filtering and searching logic
  const filteredRequests = useMemo(() => {
    return refundRequests.filter((request) => {
      const matchesSearch =
        request.rideId.toLowerCase().includes(search.toLowerCase()) ||
        request.rider.toLowerCase().includes(search.toLowerCase()) ||
        request.driver.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "All" || request.status === filters.status;

      const matchesDateRange =
        !filters.dateRange.from ||
        !filters.dateRange.to ||
        (new Date(request.date) >= filters.dateRange.from &&
          new Date(request.date) <= filters.dateRange.to);

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [refundRequests, search, filters]);

  // Predefined date ranges
  const dateRangeOptions = [
    { label: "Today", getValue: () => new Date() },
    {
      label: "Yesterday",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date;
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const date = new Date();
        date.setDate(1);
        return date;
      },
    },
    {
      label: "Last Month",
      getValue: () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        date.setDate(1);
        return date;
      },
    },
    { label: "Custom Range", getValue: () => null },
  ];

  const handleDateRangeSelect = (option: {
    label: string;
    getValue: () => Date | null;
  }) => {
    const from = option.getValue();
    if (option.label === "Custom Range") {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      dateRange: { from, to: new Date() },
    }));
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        from: range?.from ?? null,
        to: range?.to ?? null,
      },
    }));
  };

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handling row selection
  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Select all rows
  const handleSelectAll = () => {
    if (selectedRequests.length === paginatedData.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(paginatedData.map((request) => request.id));
    }
  };

  // Approve/Deny actions
  const handleApproveRequests = () => {
    setRefundRequests((prev) =>
      prev.map((request) =>
        selectedRequests.includes(request.id)
          ? { ...request, status: "Approved" as RefundStatus }
          : request
      )
    );
    setSelectedRequests([]);
  };

  // Update Calendar component props type
  const Calendar: React.FC<{
    mode: "range";
    selected: DateRange;
    onSelect: (range: DateRange | undefined) => void;
    className?: string;
  }> = ({ mode, selected, onSelect, className }) => {
    // Calendar implementation
    return null; // Replace with actual implementation
  };

  const handleDenyRequests = () => {
    setRefundRequests((prev) =>
      prev.map((request) =>
        selectedRequests.includes(request.id)
          ? { ...request, status: "Denied" as RefundStatus }
          : request
      )
    );
    setSelectedRequests([]);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 -m-4 -mt-8 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">Refund Requests</h1>
          <p className="text-sm text-gray-500">
            {filteredRequests.length} refund requests found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search rides, riders, or drivers"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div className="relative w-full lg:w-auto">
            <Button
              onClick={() => setIsExportModalOpen(true)}
              variant="outline"
              size="sm"
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
          <div className="relative w-full lg:w-auto">
            <Button
              onClick={() => setIsFilterDialogOpen(true)}
              variant="outline"
              size="sm"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-300"
            >
              <FilterIcon className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>
      </div>

      {/* the ExportFilterModal here */}
      <ExportFilterModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={refundRequests}
      />

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="text-lg font-bold mb-4">
            Filter Refund Requests
          </DialogTitle>

          <div className="space-y-6">
            {/* Date Range and Calendar Row */}
            <div className="flex gap-6">
              {/* Left: Date Range Options */}
              <div className="w-64 flex-shrink-0">
                <h3 className="font-medium mb-3">Date Range</h3>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleDateRangeSelect(option)}
                      className="w-full text-left px-3 py-2 rounded text-sm hover:bg-white transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Calendar */}
              <div className="flex-grow">
                <h3 className="font-medium mb-3">Select Dates</h3>
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={handleCalendarSelect}
                  className="rounded-lg border bg-white w-full"
                />
              </div>
            </div>

            {/* Status Filter Row */}
            <div>
              <h3 className="font-medium mb-3">Status</h3>
              <div className="grid grid-cols-4 gap-3">
                {(["All", "Pending", "Approved", "Denied"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          status,
                        }))
                      }
                      className={`px-4 py-2 rounded-lg transition-colors text-sm
                      ${
                        filters.status === status
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {status} Requests
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  status: "All",
                  dateRange: { from: null, to: null },
                });
                setIsFilterDialogOpen(false);
              }}
            >
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="w-[50px]">
              <input
                type="checkbox"
                checked={selectedRequests.length === paginatedData.length}
                onChange={handleSelectAll}
                className="h-4 w-4"
              />
            </TableCell>
            <TableCell>Ride ID</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Rider</TableCell>
            <TableCell>Driver</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => handleSelectRequest(request.id)}
                  className="h-4 w-4"
                />
              </TableCell>
              <TableCell>{request.rideId}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{request.rider}</TableCell>
              <TableCell>{request.driver}</TableCell>
              <TableCell>{request.date}</TableCell>
              <TableCell>${request.amount.toFixed(2)}</TableCell>
              <TableCell>
                {/* we need to fliter what we need  */}
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    request.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRefundRequests((prev) =>
                      prev.map((r) =>
                        r.id === request.id ? { ...r, status: "Approved" } : r
                      )
                    );
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  Approve
                  <CheckIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRefundRequests((prev) =>
                      prev.map((r) =>
                        r.id === request.id ? { ...r, status: "Denied" } : r
                      )
                    );
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Deny
                  <XIcon className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
  <span className="text-sm text-gray-500">
    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
    {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
    {filteredRequests.length} records
  </span>
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(currentPage - 1);
          }} 
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
      {[...Array(totalPages)].map((_, i) => (
        <PaginationItem key={i + 1}>
          <PaginationLink 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i + 1);
            }}
            isActive={currentPage === i + 1}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(currentPage + 1);
          }}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
    </div>
  );
};

export default RefundRequestsPage;
