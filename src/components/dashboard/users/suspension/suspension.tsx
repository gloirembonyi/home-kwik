import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FilterIcon,
  ChevronDownIcon,
  ImportIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/base/dropdown-menu";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import { cn } from "@/lib/utils";

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
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtering and search logic
  const filteredSuspensions = useMemo(() => {
    return suspensions.filter(
      (suspension) =>
        (statusFilter === "All" || suspension.status === statusFilter) &&
        (searchTerm === "" ||
          suspension.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          suspension.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          suspension.reason.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
        : paginatedSuspensions.map((item) => item.id)
    );
  };

  // Export functionality (mock)
  const handleExport = () => {
    const dataToExport =
      selectedItems.length > 0
        ? suspensions.filter((item) => selectedItems.includes(item.id))
        : suspensions;

    const csvContent = dataToExport
      .map(
        (item) =>
          `${item.name},${item.email},${item.phone},${item.reason},${item.status}`
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "suspension_history.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredSuspensions.length / itemsPerPage);

  return (
    <div className="bg-background min-h-screen p-6 -m-4 -mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Suspension History
            </h1>
            <p className="text-sm text-muted-foreground">
              All suspended users in the system
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              id="search-suspensions"
              placeholder="Search users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleExport} variant="default" className="gap-2">
              <ImportIcon className="w-4 h-4" />
              <span>Export</span>
            </Button>

            {/* Dropdown Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FilterIcon className="w-4 h-4" />
                  <span>{statusFilter}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => setStatusFilter("All")}
                  className={cn(
                    "cursor-pointer",
                    statusFilter === "All" ? "bg-accent" : ""
                  )}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Suspended")}
                  className={cn(
                    "cursor-pointer",
                    statusFilter === "Suspended" ? "bg-accent" : ""
                  )}
                >
                  Suspended
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("Unsuspended")}
                  className={cn(
                    "cursor-pointer",
                    statusFilter === "Unsuspended" ? "bg-accent" : ""
                  )}
                >
                  Unsuspended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card shadow-sm rounded-lg overflow-hidden border border-border">
          <table className="w-full table-auto">
            <thead className="bg-muted/50">
              <tr className="text-sm text-muted-foreground">
                <th className="p-4 text-center font-medium">
                  <Checkbox
                    checked={
                      selectedItems.length === paginatedSuspensions.length &&
                      paginatedSuspensions.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
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
            <tbody className="divide-y divide-border">
              {paginatedSuspensions.map((record) => (
                <tr key={record.id} className="hover:bg-accent/5">
                  <td className="p-4 text-center">
                    <Checkbox
                      checked={selectedItems.includes(record.id)}
                      onCheckedChange={() => toggleItemSelection(record.id)}
                    />
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {record.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {record.name}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {record.date}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {record.email}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {record.phone}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground truncate max-w-xs">
                    {record.reason}
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium tracking-wide inline-block",
                        record.status === "Suspended"
                          ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      )}
                    >
                      {record.status}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredSuspensions.length)}{" "}
            out of {filteredSuspensions.length} records
          </p>
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                className={cn(
                  "min-w-[32px] h-8",
                  currentPage === index + 1
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-accent"
                )}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensionHistory;
