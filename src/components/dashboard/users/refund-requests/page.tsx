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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/base/pagination";
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/base/dialog";
import { Calendar } from "@/components/ui/base/calendar";
import ExportFilterModal from "./ExportFilterModal";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

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
    return <div className="p-6 text-center text-foreground">Loading...</div>;
  }

  return (
    <div className="p-6 -m-4 -mt-8 bg-background min-h-screen">
      {/* Header section */}
      <div className="items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground">
            Refund Requests
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {filteredRequests.length} refund requests found
          </p>
        </div>

          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <input
                type="search"
                placeholder="Search rides, riders, or drivers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 pl-10 pr-4 py-2.5 bg-background border border-input rounded-md
                  text-sm placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  transition-colors duration-200"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <Button
                onClick={() => setIsExportModalOpen(true)}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </Button>
              <Button
                onClick={() => setIsFilterDialogOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FilterIcon className="w-4 h-4" /> Filter
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
          <DialogTitle className="text-lg font-bold mb-4 text-foreground">
            Filter Refund Requests
          </DialogTitle>

          <div className="space-y-6">
            {/* Date Range and Calendar Row */}
            <div className="flex gap-6">
              {/* Left: Date Range Options */}
              <div className="w-64 flex-shrink-0">
                <h3 className="font-medium mb-3 text-foreground">Date Range</h3>
                <div className="space-y-2 bg-muted rounded-lg p-3">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleDateRangeSelect(option)}
                      className="w-full text-left px-3 py-2 rounded text-sm hover:bg-accent/50 text-foreground transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Calendar */}
              <div className="flex-grow">
                <h3 className="font-medium mb-3 text-foreground">
                  Select Dates
                </h3>
                <Calendar
                  mode="range"
                  selected={filters.dateRange}
                  onSelect={handleCalendarSelect}
                  className="rounded-lg border border-border bg-card w-full"
                />
              </div>
            </div>

            {/* Status Filter Row */}
            <div>
              <h3 className="font-medium mb-3 text-foreground">Status</h3>
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
                          ? "bg-primary/20 text-primary font-medium"
                          : "bg-muted hover:bg-accent/50 text-foreground"
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
      <div className="border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableCell className="w-[50px]">
                <Checkbox
                  checked={selectedRequests.length === paginatedData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableCell>
              <TableCell className="font-medium">Ride ID</TableCell>
              <TableCell className="font-medium">Reason</TableCell>
              <TableCell className="font-medium">Rider</TableCell>
              <TableCell className="font-medium">Driver</TableCell>
              <TableCell className="font-medium">Date</TableCell>
              <TableCell className="font-medium">Amount</TableCell>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell className="font-medium">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((request) => (
              <TableRow key={request.id} className="hover:bg-accent/5">
                <TableCell>
                  <Checkbox
                    checked={selectedRequests.includes(request.id)}
                    onCheckedChange={() => handleSelectRequest(request.id)}
                  />
                </TableCell>
                <TableCell>{request.rideId}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{request.rider}</TableCell>
                <TableCell>{request.driver}</TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>${request.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
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
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Approve
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
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <XIcon className="w-4 h-4 mr-1" />
                    Deny
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
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
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
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
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default RefundRequestsPage;
