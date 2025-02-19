"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Eye, Pencil, Trash2, Filter, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/base/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base/select";
import { Button } from "@/components/ui/base/button";
import { Separator } from "@/components/ui/base/separator";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import ExportTopupDialog from "./export-topup";
import FilterTopupDialog from "./filter-topup";
import { FilterOptions } from "./filter-topup";

export interface Transaction {
  id: string;
  timestamp: string;
  mobileNumber: string;
  user: string;
  amount: string;
  status: "Successful" | "Failed" | "Pending";
}

const TopupHistory = () => {
  // Initialize states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(
    null
  );

  // Update the sample data with proper date format
  const allTransactions: Transaction[] = Array(60)
    .fill(null)
    .map((_, index) => ({
      id: `${index + 1}`,
      timestamp: new Date(2024, 0, 15, 20, 40).toISOString(), // Use ISO string for dates
      mobileNumber: "07820 242 525",
      user: "Darlene Robertson",
      amount: "29000", // Store amount as number string without currency
      status:
        Math.random() > 0.7
          ? "Failed"
          : Math.random() > 0.3
          ? "Successful"
          : "Pending", // Add some variety to status
    }));

  // Initialize filteredTransactions with allTransactions
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(allTransactions);

  // Update search functionality
  useEffect(() => {
    const filtered = allTransactions.filter(
      (transaction) =>
        transaction.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.mobileNumber.includes(searchQuery) ||
        transaction.amount.includes(searchQuery)
    );
    setFilteredTransactions(filtered);
  }, [searchQuery]); // Remove allTransactions from dependencies

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / Number(itemsPerPage));
  const startIndex = (currentPage - 1) * Number(itemsPerPage);
  const endIndex = startIndex + Number(itemsPerPage);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Stats calculations
  const stats = {
    totalTransactions: filteredTransactions.length,
    totalAmount: `${filteredTransactions
      .reduce((sum, t) => sum + parseInt(t.amount, 10), 0)
      .toLocaleString()} RWF`,
    totalUsers: new Set(filteredTransactions.map((t) => t.user)).size,
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    let filtered = [...allTransactions];

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.timestamp);
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (transactionDate < fromDate) return false;
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (transactionDate > toDate) return false;
        }
        return true;
      });
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === filters.status
      );
    }

    // Amount range filter
    if (filters.amountRange.min || filters.amountRange.max) {
      filtered = filtered.filter((transaction) => {
        const amount = parseInt(transaction.amount, 10);
        const min = filters.amountRange.min
          ? parseInt(filters.amountRange.min, 10)
          : 0;
        const max = filters.amountRange.max
          ? parseInt(filters.amountRange.max, 10)
          : Infinity;
        return amount >= min && amount <= max;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  // Add clearFilters function
  const clearFilters = () => {
    setActiveFilters(null);
    setFilteredTransactions(allTransactions);
  };

  // Update the display formatting
  const formatAmount = (amount: string) => {
    return `${parseInt(amount, 10).toLocaleString()} RWF`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 bg-background min-h-screen text-foreground">
      {/* Header with Search and Actions */}
      <div className="bg-card shadow-lg rounded-xl p-4 border border-border">
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="search"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-72 pl-10 pr-4 py-3 bg-background border-1 border-input rounded-lg 
                       focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
            <MagnifyingGlassIcon className="absolute items-center left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Button
                variant="outline"
                className="flex gap-2 h-10"
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="h-5 w-5" />
                Filter
                {activeFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </Button>
              {activeFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 h-10 flex gap-2 text-primary-foreground"
              onClick={() => setIsExportDialogOpen(true)}
            >
              <Download className="h-5 w-5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: "Total Topup Transactions", value: stats.totalTransactions },
          { title: "Total Amount", value: stats.totalAmount },
          { title: "Total Users", value: stats.totalUsers },
        ].map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-primary mb-3">
                <div className="p-2 bg-primary/10 rounded">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <span className="text-sm text-foreground">{stat.title}</span>
              </div>
              <div className="text-2xl font-semibold mb-3 text-foreground">
                {stat.value}
              </div>
              <Separator className="mb-3" />
              <div className="text-sm text-muted-foreground">
                Last Update: November 14, 2024
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-lg border border-border shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-border bg-muted">
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  Date stamp
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  Mobile Number
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-accent/5"
                >
                  <td className="px-6 py-4 text-foreground">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {transaction.mobileNumber}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {transaction.user}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-accent/50"
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-accent/50"
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-accent/50"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-muted">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing</span>
            <Select
              value={itemsPerPage}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} out
              of {totalItems} records
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ←
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`h-8 w-8 ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ExportTopupDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        transactions={filteredTransactions}
      />

      <FilterTopupDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default TopupHistory;
