import { Filter, Check } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/base/button";
import { Checkbox } from "@/components/ui/base/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { cn } from "@/lib/utils";

type RowType = {
  name: string;
  appliedDate: string;
  answeredDate: string;
  email: string;
  phone: string;
  status: string;
};

const TablePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Initial data
  const initialData = [
    {
      name: "Leasie Watson",
      appliedDate: "July 14, 2023",
      answeredDate: "July 14, 2023",
      email: "leasie.w@demo.com",
      phone: "(250) 789490129",
      status: "Approved",
    },
    {
      name: "Floyd Miles",
      appliedDate: "July 14, 2023",
      answeredDate: "Not Available Yet",
      email: "floyd.m@demo.com",
      phone: "(250) 789490129",
      status: "In Process",
    },
    {
      name: "Theresa Webb",
      appliedDate: "July 14, 2023",
      answeredDate: "Not Available Yet",
      email: "theresa.w@demo.com",
      phone: "(250) 789490129",
      status: "In Process",
    },
    {
      name: "Darlene Robertson",
      appliedDate: "July 14, 2023",
      answeredDate: "Not Available Yet",
      email: "darlene.r@demo.com",
      phone: "(250) 789490129",
      status: "In Process",
    },
    {
      name: "Esther Howard",
      appliedDate: "July 14, 2023",
      answeredDate: "July 14, 2023",
      email: "esther.h@demo.com",
      phone: "(250) 789490129",
      status: "Rejected",
    },
    {
      name: "Darrell Steward",
      appliedDate: "July 14, 2023",
      answeredDate: "July 14, 2023",
      email: "darrell.s@demo.com",
      phone: "(250) 789490129",
      status: "Rejected",
    },
    {
      name: "Ronald Richards",
      appliedDate: "July 14, 2023",
      answeredDate: "July 14, 2023",
      email: "ronald.r@demo.com",
      phone: "(250) 789490129",
      status: "Approved",
    },
    {
      name: "Jacob Jones",
      appliedDate: "July 14, 2023",
      answeredDate: "Not Available Yet",
      email: "jacob.j@demo.com",
      phone: "(250) 789490129",
      status: "Approved",
    },
    {
      name: "Cameron Williamson",
      appliedDate: "July 14, 2023",
      answeredDate: "Not Available Yet",
      email: "cameron.w@demo.com",
      phone: "(250) 789490129",
      status: "In Process",
    },
    {
      name: "Bessie Cooper",
      appliedDate: "July 14, 2023",
      answeredDate: "July 14, 2023",
      email: "bessie.c@demo.com",
      phone: "(250) 789490129",
      status: "Rejected",
    },
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading state

    return () => clearTimeout(timer);
  }, []);

  // State for filters and selection
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    appliedDate: "",
    answeredDate: "",
  });

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Styling for status
  const statuses: { [key: string]: string } = {
    Approved: "bg-green-100 text-green-700",
    "In Process": "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
  };

  // filtering logic
  const filteredAndSortedData = useMemo(() => {
    let result = initialData.filter((row) => {
      // Search filter (case-insensitive, across multiple fields)
      const matchesSearch =
        filters.search === "" ||
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(filters.search.toLowerCase())
        );

      const matchesStatus =
        filters.status === "All" || row.status === filters.status;

      const matchesAppliedDate =
        !filters.appliedDate || row.appliedDate === filters.appliedDate;

      const matchesAnsweredDate =
        !filters.answeredDate || row.answeredDate === filters.answeredDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAppliedDate &&
        matchesAnsweredDate
      );
    });

    // Sorting logic
    if (sortColumn) {
      result.sort((a, b) => {
        const valueA = a[sortColumn as keyof RowType] ?? "";
        const valueB = b[sortColumn as keyof RowType] ?? "";

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [filters, sortColumn, sortDirection]);

  // Pagination
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handler to update filters
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    name?: string
  ) => {
    const value = typeof e === "string" ? e : e.target.value;
    const filterName = typeof e === "string" ? name! : e.target.name;

    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Row selection handler
  const handleRowSelect = (rowIndex: number) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((index) => index !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };

  // Select all rows on current page
  const handleSelectAll = () => {
    const currentPageIndexes = paginatedData.map((_, index) =>
      filteredAndSortedData.indexOf(paginatedData[index])
    );

    const allSelected = currentPageIndexes.every((index) =>
      selectedRows.includes(index)
    );

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter((index) => !currentPageIndexes.includes(index))
      );
    } else {
      setSelectedRows((prev) => {
        const newSelection = [...prev];
        currentPageIndexes.forEach((index) => {
          if (!newSelection.includes(index)) {
            newSelection.push(index);
          }
        });
        return newSelection;
      });
    }
  };

  // Export functionality
  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ["Name", "Applied Date", "Answered Date", "Email", "Phone", "Status"],
      ...filteredAndSortedData.map((row) => [
        row.name,
        row.appliedDate,
        row.answeredDate,
        row.email,
        row.phone,
        row.status,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "user_data_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Skeleton Placeholder
  if (isLoading) {
    return (
      <div className="min-h-screen -mt-6 -ml-4 -mr-4">
        <div className="bg-background p-6">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-5 bg-muted rounded w-1/3"></div>
          </div>

          {/* Filtering Section Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="h-10 bg-muted rounded-md w-full md:w-80"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-24 bg-muted rounded-md"></div>
              <div className="h-10 w-24 bg-muted rounded-md"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="w-full border border-border bg-card rounded-lg">
            {/* Header Skeleton */}
            <div className="bg-muted/50 grid grid-cols-7 border-b border-border">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="px-4 py-2 border-r last:border-r-0 h-10 bg-muted"
                ></div>
              ))}
            </div>

            {/* Rows Skeleton */}
            {[...Array(8)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-7 border-b border-border last:border-b-0 hover:bg-accent/5"
              >
                {[...Array(7)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={cn(
                      "px-4 py-4 border-r border-border last:border-r-0 flex items-center",
                      colIndex === 0 ? "justify-center" : "",
                      colIndex === 1 ? "space-x-2" : ""
                    )}
                  >
                    {colIndex === 0 && (
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    )}
                    {colIndex === 1 && (
                      <>
                        <div className="h-8 w-8 rounded-full bg-muted"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </>
                    )}
                    {colIndex !== 0 && colIndex !== 1 && (
                      <div className="h-4 bg-muted rounded w-full"></div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-4">
            <div className="h-5 bg-muted rounded w-1/4"></div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-8 w-8 bg-muted rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-6 -ml-4 -mr-4">
      <div className="bg-background p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            All Driver Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            All Driver requests progress
          </p>
        </div>

        {/* Filtering Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Input
              type="text"
              name="search"
              id="search-drivers"
              placeholder="Search users..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full md:w-80"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange(value, "status")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button onClick={handleExport} variant="default" className="gap-2">
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {/* Checkbox Column */}
                <th className="px-4 py-2 w-12">
                  <Checkbox
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((_, index) =>
                        selectedRows.includes(
                          filteredAndSortedData.indexOf(paginatedData[index])
                        )
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                {[
                  { key: "name", label: "User Name" },
                  { key: "appliedDate", label: "Applied Date" },
                  { key: "answeredDate", label: "Answered Date" },
                  { key: "email", label: "Email Address" },
                  { key: "phone", label: "Mobile Number" },
                  { key: "status", label: "Status" },
                ].map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className="px-4 py-2 text-left text-muted-foreground font-medium cursor-pointer hover:bg-accent/50"
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="ml-2">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.map((row, index) => {
                const globalIndex = filteredAndSortedData.indexOf(row);
                const isSelected = selectedRows.includes(globalIndex);

                return (
                  <tr
                    key={index}
                    className={cn(
                      "hover:bg-accent/5",
                      isSelected && "bg-accent/10"
                    )}
                  >
                    {/* Checkbox Cell */}
                    <td className="px-4 py-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRowSelect(globalIndex)}
                      />
                    </td>
                    <td className="px-4 py-2 flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {row.name.charAt(0)}
                      </div>
                      <span className="text-foreground">{row.name}</span>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.appliedDate}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.answeredDate}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.email}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.phone}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          {
                            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300":
                              row.status === "Approved",
                            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300":
                              row.status === "In Process",
                            "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300":
                              row.status === "Rejected",
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}{" "}
            out of {filteredAndSortedData.length} records
          </span>
          <div className="flex space-x-2">
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

export default TablePage;
