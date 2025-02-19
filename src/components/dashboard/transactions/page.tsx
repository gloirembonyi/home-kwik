"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TransactionDetailsPage from "./transaction-detail";
import { DateRange } from "react-day-picker";
import ExportFilterModal from "./export-filter-transactions";
import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";

type Transaction = {
  transactionId: string;
  phoneNumber: string;
  payeeName: string;
  driverName: string;
  date: string; // Use Date if you handle Date objects
  amount: string;
  status: string;
  description?: string; // Optional field
};

type ExportData = {
  [key: string]: string; // Generic object with string keys and values
};

// Mock data generator
const generateMockTransactions = () => {
  const statuses = ["Successful", "Pending", "Failed"];
  const drivers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Emily Brown",
    "David Lee",
  ];
  const payees = [
    "Darlene Robertson",
    "Alice Cooper",
    "Bob Martin",
    "Sarah Connor",
    "Tom Hardy",
  ];

  return Array.from({ length: 60 }, (_, index) => ({
    id: `TXN-${String(index + 1).padStart(6, "0")}`,
    transactionId: `TXN-${String(index + 1).padStart(6, "0")}`,
    phoneNumber: `078${Math.floor(10000000 + Math.random() * 90000000)}`,
    payeeName: payees[Math.floor(Math.random() * payees.length)],
    driverName: drivers[Math.floor(Math.random() * drivers.length)],
    date: new Date(
      2024,
      0,
      Math.floor(Math.random() * 30) + 1
    ).toLocaleDateString("en-GB"),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: (Math.random() * 1000).toFixed(2),
    description: "Payment for ride services",
  }));
};

const TransactionsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const transactions: Transaction[] = generateMockTransactions();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const convertToTimezone = (date: Date, timezone: string): Date => {
    if (timezone === "GMT+2") {
      return new Date(date.getTime() + 2 * 60 * 60 * 1000);
    }
    return date;
  };

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulates a 1.5-second loading time

    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      Object.values(transaction).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, transactions]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredTransactions, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Failed":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleView = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const handleBack = () => {
    setSelectedTransaction(null);
  };

  const filterTransactionsByDate = (
    transactions: Transaction[],
    range: DateRange | undefined
  ) => {
    if (!range?.from || !range?.to) return transactions;

    return transactions.filter((transaction) => {
      const transactionDate = new Date(
        transaction.date.split("/").reverse().join("-")
      );
      return transactionDate >= range.from! && transactionDate <= range.to!;
    });
  };

  const handleExport = async (
    dateRange: DateRange | undefined,
    timezone: string
  ) => {
    const filteredTransactions = filterTransactionsByDate(
      transactions,
      dateRange
    );

    const exportData: ExportData[] = filteredTransactions.map(
      (transaction) => ({
        "Transaction ID": transaction.transactionId,
        "Phone Number": transaction.phoneNumber,
        "Payee Name": transaction.payeeName,
        "Driver Name": transaction.driverName,
        Date: convertToTimezone(
          new Date(transaction.date.split("/").reverse().join("-")),
          timezone
        )
          .toISOString()
          .replace("T", " ")
          .split(".")[0],
        Amount: `£${transaction.amount}`,
        Status: transaction.status,
      })
    );

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((header) =>
            JSON.stringify(row[header as keyof ExportData] || "")
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const filename = `transactions_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If a transaction is selected, show its details
  if (selectedTransaction) {
    return (
      <TransactionDetailsPage
        transaction={selectedTransaction}
        onBack={handleBack}
      />
    );
  }

  // Skeleton Placeholder
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>

          {/* Toolbar Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3 h-10 bg-muted rounded"></div>
            <div className="h-10 w-24 bg-muted rounded"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
            <div className="bg-muted/50 border-b h-14"></div>
            <div className="divide-y divide-border">
              {Array(10)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex items-center p-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                      <div
                        key={col}
                        className="flex-1 h-4 bg-muted rounded mr-4"
                        style={{ width: `${Math.random() * 50 + 50}%` }}
                      ></div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-6">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex space-x-2">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="w-8 h-8 bg-muted rounded"></div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-6 -m-4 -mt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          Overview of all payment transactions
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative flex items-center">
          <input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-80 pl-10 pr-4 py-2.5 bg-background border border-input rounded-md
              text-sm placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-colors duration-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant="default"
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {[
                "Transaction ID",
                "Phone Number",
                "Payee Name",
                "Driver Name",
                "Date",
                "Amount",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-muted-foreground font-semibold uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTransactions.map((transaction, index) => (
              <tr key={transaction.transactionId} className="hover:bg-accent/5">
                <td className="px-6 py-4 font-medium text-foreground">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {transaction.phoneNumber}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {transaction.payeeName}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {transaction.driverName}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  £{transaction.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(transaction)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedTransactions.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No transactions found.
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
          of {filteredTransactions.length} records
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="min-w-[32px] h-8"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ExportFilterModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default TransactionsList;
