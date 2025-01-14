import React, {
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationContent,
} from "@/components/ui/base/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/base/table";
import { Input } from "@/components/ui/Input";
import { SearchIcon } from "lucide-react";

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
      status: "Success",
    },
    {
      id: 2,
      name: "Floyd Miles",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "floyd.m@demo.com",
      phone: "(250) 789-490-129",
      description: "Password reset attempt",
      status: "Success",
    },
    {
      id: 3,
      name: "Theresa Webb",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "theresa.w@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Pending",
    },
    {
      id: 4,
      name: "Darlene Robertson",
      date: "July 14, 2023",
      timestamp: "Not Available Yet",
      email: "darlene.r@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Failed",
    },
    {
      id: 5,
      name: "Esther Howard",
      date: "July 14, 2023",
      timestamp: "July 14, 2023",
      email: "esther.h@demo.com",
      phone: "(250) 789490129",
      description: "Password reset attempt",
      status: "Pending",
    },
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  // Pagination settings
  const ITEMS_PER_PAGE = 10;

  // Advanced filtering
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesDateFrom =
        !filters.dateFrom || new Date(item.date) >= new Date(filters.dateFrom);

      const matchesDateTo =
        !filters.dateTo || new Date(item.date) <= new Date(filters.dateTo);

      const matchesStatus =
        !filters.status ||
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
    const dataToExport =
      selectedRows.length > 0
        ? initialData.filter((item) => selectedRows.includes(item.id))
        : initialData;

    const csvContent = [
      "Name,Date,Timestamp,Email,Phone,Description,Status",
      ...dataToExport.map(
        (item) =>
          `${item.name},${item.date},${item.timestamp},${item.email},${item.phone},${item.description},${item.status}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "audit_logs_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedRows, initialData]);

  // Filter handlers
  const handleFilterChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
    });
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 bg-background min-h-screen p-6 -m-4 -mt-8">
      {/* Header with Search and Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground">Audit Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              id="search-logs"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10"
            />
          </div>
          <Button
            onClick={handleExport}
            disabled={selectedRows.length === 0}
            variant="default"
            className="disabled:opacity-50"
          >
            Export {selectedRows.length > 0 ? `(${selectedRows.length})` : ""}
          </Button>
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Date From
              </label>
              <Input
                type="date"
                id="date-from-filter"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Date To
              </label>
              <Input
                type="date"
                id="date-to-filter"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg bg-card shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableCell className="w-12 text-center">
                <Checkbox
                  checked={
                    selectedRows.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell className="font-medium">Name</TableCell>
              <TableCell className="font-medium">Date</TableCell>
              <TableCell className="font-medium">Timestamp</TableCell>
              <TableCell className="font-medium">Email</TableCell>
              <TableCell className="font-medium">Phone</TableCell>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell className="font-medium">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-accent/5 transition-colors"
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onCheckedChange={() => toggleRowSelection(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.timestamp}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Success"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {Math.min(
            (currentPage - 1) * ITEMS_PER_PAGE + 1,
            filteredData.length
          )}{" "}
          to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of{" "}
          {filteredData.length} entries
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
            {Array.from(
              { length: Math.ceil(filteredData.length / ITEMS_PER_PAGE) },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem
                key={page}
                className={`${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent/50"
                } cursor-pointer px-3 py-1 rounded-md`}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </a>
              </PaginationItem>
            ))}
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
                  )
                );
              }}
              aria-disabled={
                currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)
              }
              className={
                currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AuditLogs;
