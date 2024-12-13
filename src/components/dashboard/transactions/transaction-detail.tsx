import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  FileText,
  Download,
  MapPin,
  Clock,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Phone, VenetianMask, Star } from "lucide-react";

type TransactionDetailsProps = {
  transaction: any;
  onBack?: () => void;
};

const TransactionDetailsPage: React.FC<TransactionDetailsProps> = ({
  transaction,
  onBack,
}) => {
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Placeholder for actual transaction data
  const mockTransaction = {
    transactionId: transaction?.transactionId || "T001",
    driverName: transaction?.driverName || "John Doe",
    driverPhone: transaction?.driverPhone || "+250 788 123 456",
    driverGender: transaction?.driverGender || "Male",
    driverRating: transaction?.driverRating || "4.5",
    riderName: transaction?.riderName || "Jane Smith",
    riderPhone: transaction?.riderPhone || "+250 787 654 321",
    riderGender: transaction?.riderGender || "Female",
    riderRating: transaction?.riderRating || "4.7",
    distance: transaction?.distance || "12.5",
    timeTaken: transaction?.timeTaken || "25 mins",
    amount: transaction?.amount || "2500",
    paymentMethod: transaction?.paymentMethod || "Mobile Money",
    paymentAccount: transaction?.paymentAccount || "250788XXXXX",
    status: transaction?.status || "Successful",
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  // Simplified export functionality
  const exportDocument = (format: "pdf" | "csv") => {
    const transactionData = {
      "Transaction ID": mockTransaction.transactionId,
      "Driver Name": mockTransaction.driverName,
      "Driver Phone": mockTransaction.driverPhone,
      "Driver Gender": mockTransaction.driverGender,
      "Driver Rating": mockTransaction.driverRating,
      "Rider Name": mockTransaction.riderName,
      "Rider Phone": mockTransaction.riderPhone,
      "Rider Gender": mockTransaction.riderGender,
      "Rider Rating": mockTransaction.riderRating,
      "Distance Covered": `${mockTransaction.distance} Kilometres`,
      "Time Taken": mockTransaction.timeTaken,
      "Total Amount": `${mockTransaction.amount} FRW`,
      "Payment Method": mockTransaction.paymentMethod,
      "Payment Account": mockTransaction.paymentAccount,
      Status: mockTransaction.status,
    };

    // Export to CSV
    const exportToCSV = () => {
      const csvContent = [
        Object.keys(transactionData).join(","),
        Object.values(transactionData)
          .map(
            (value) => `"${value.replace(/"/g, '""')}"` 
          )
          .join(","),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transaction_${mockTransaction.transactionId}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Export to PDF (using browser's print functionality)
    const exportToPDF = () => {
      const printWindow = window.open("", "_blank");

      // Create a clean, printable HTML document
      const htmlContent = `
        <html>
          <head>
            <title>Transaction Details - ${
              mockTransaction.transactionId
            }</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
              }
              h1 { color: #333; text-align: center; }
              .section { 
                margin-bottom: 20px; 
                border-bottom: 1px solid #eee; 
                padding-bottom: 10px; 
              }
              .row { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 10px; 
              }
              .label { font-weight: bold; }
              .value { text-align: right; }
            </style>
          </head>
          <body>
            <h1>Transaction Details</h1>
            ${Object.entries(transactionData)
              .map(
                ([label, value]) => `
              <div class="section">
                <div class="row">
                  <span class="label">${label}:</span>
                  <span class="value">${value}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </body>
        </html>
      `;

      printWindow?.document.write(htmlContent);
      printWindow?.document.close();
      printWindow?.print();
    };

    // Execute export based on selected format
    if (format === "csv") {
      exportToCSV();
    } else {
      exportToPDF();
    }

    // Close dropdown
    setIsExportDropdownOpen(false);
  };
  return (
    <div className="flex justify-center items-center">
      <div className="w-full bg-white   overflow-hidden  border-blue-100">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Transaction Details
            </h1>
            <p className="text-sm md:text-base text-blue-500 flex items-center space-x-2">
              <span className="font-medium">Transaction ID:</span>
              <span className="bg-blue-500/40 px-2 py-0.5 rounded">
                {mockTransaction.transactionId}
              </span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="mt-4 md:mt-0 flex items-center space-x-2 hover:bg-blue-600/30 p-2 rounded-md transition duration-300 ease-in-out"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Driver Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transform transition hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center shadow-md">
                <User className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Driver Details
                </h2>
                <p className="text-sm text-gray-500">Professional Driver</p>
              </div>
            </div>
            <div className="space-y-3">
              <DetailRow
                icon={<User className="w-5 h-5 text-blue-500" />}
                label="Name"
                value={mockTransaction.driverName}
              />
              <DetailRow
                icon={<Phone className="w-5 h-5 text-green-500" />}
                label="Phone"
                value={mockTransaction.driverPhone}
              />
              <DetailRow
                icon={<VenetianMask className="w-5 h-5 text-purple-500" />}
                label="Gender"
                value={mockTransaction.driverGender}
              />
              <DetailRow
                icon={<Star className="w-5 h-5 text-yellow-500" />}
                label="Rating"
                value={mockTransaction.driverRating}
              />
            </div>
          </div>

          {/* Rider Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transform transition hover:scale-[1.02]">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
                <User className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Rider Details
                </h2>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div className="space-y-3">
              <DetailRow
                icon={<User className="w-5 h-5 text-purple-500" />}
                label="Name"
                value={mockTransaction.riderName}
              />
              <DetailRow
                icon={<Phone className="w-5 h-5 text-green-500" />}
                label="Phone"
                value={mockTransaction.riderPhone}
              />
              <DetailRow
                icon={<VenetianMask className="w-5 h-5 text-purple-500" />}
                label="Gender"
                value={mockTransaction.riderGender}
              />
              <DetailRow
                icon={<Star className="w-5 h-5 text-yellow-500" />}
                label="Rating"
                value={mockTransaction.riderRating}
              />
            </div>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="p-6 md:p-8 md:pt-1 bg-gray-50">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Transaction Information
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <DetailRow
                icon={<MapPin className="w-5 h-5 text-green-500" />}
                label="Distance Covered"
                value={`${mockTransaction.distance} Kilometres`}
              />
              <DetailRow
                icon={<Clock className="w-5 h-5 text-blue-500" />}
                label="Time Taken"
                value={mockTransaction.timeTaken}
              />
              <DetailRow
                icon={<CreditCard className="w-5 h-5 text-indigo-500" />}
                label="Total Amount"
                value={`${mockTransaction.amount} FRW`}
              />
              <DetailRow
                icon={<CreditCard className="w-5 h-5 text-pink-500" />}
                label="Payment Method"
                value={mockTransaction.paymentMethod}
              />
              <DetailRow
                icon={<FileText className="w-5 h-5 text-gray-500" />}
                label="Payment Account"
                value={mockTransaction.paymentAccount}
              />
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium w-max ${getStatusStyles(
                    mockTransaction.status
                  )}`}
                >
                  {mockTransaction.status}
                </span>
              </div>
            </div>
             {/* Export Button with Dropdown */}
        <div className="p-6 md:p-8 text-right flex justify-end">
          <div className="relative">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Export Document</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isExportDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <ul className="py-1 rounded-lg">
                  <li
                    onClick={() => exportDocument("pdf")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export as PDF</span>
                  </li>
                  <li
                    onClick={() => exportDocument("csv")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export as CSV</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistent detail row rendering
const DetailRow: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {icon && <span>{icon}</span>}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

export default TransactionDetailsPage;
