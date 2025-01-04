import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import TransactionDetailsPage from './transaction-detail';

// Mock data generator
const generateMockTransactions = () => {
  const statuses = ['Successful', 'Pending', 'Failed'];
  const drivers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Brown', 'David Lee'];
  const payees = ['Darlene Robertson', 'Alice Cooper', 'Bob Martin', 'Sarah Connor', 'Tom Hardy'];

  return Array.from({ length: 60 }, (_, index) => ({
    id: `TXN-${String(index + 1).padStart(6, '0')}`,
    transactionId: `TXN-${String(index + 1).padStart(6, '0')}`,
    phoneNumber: `078${Math.floor(10000000 + Math.random() * 90000000)}`,
    payeeName: payees[Math.floor(Math.random() * payees.length)],
    driverName: drivers[Math.floor(Math.random() * drivers.length)],
    date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-GB'),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: (Math.random() * 1000).toFixed(2),
    description: 'Payment for ride services'
  }));
};

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [transactions] = useState(generateMockTransactions());
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulates a 1.5-second loading time

    return () => clearTimeout(timer);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      Object.values(transaction).some(value =>
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
      case 'Successful': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleView = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const handleBack = () => {
    setSelectedTransaction(null);
  };

  const handleExport = () => {
    // Convert transactions to CSV
    const csvContent = [
      ['Transaction ID', 'Phone Number', 'Payee Name', 'Driver Name', 'Date', 'Amount', 'Status'],
      ...transactions.map(t => [
        t.transactionId, 
        t.phoneNumber, 
        t.payeeName, 
        t.driverName, 
        t.date, 
        `£${t.amount}`, 
        t.status
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      <div className="bg-gray-50 min-h-screen p-6">

        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>

          {/* Toolbar Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3 h-10 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-gray-100 border-b h-14"></div>
            <div className="divide-y divide-gray-200">
              {Array(10).fill(null).map((_, index) => (
                <div key={index} className="flex items-center p-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                    <div 
                      key={col} 
                      className="flex-1 h-4 bg-gray-200 rounded mr-4"
                      style={{ width: `${Math.random() * 50 + 50}%` }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex space-x-2">
              {Array(5).fill(null).map((_, index) => (
                <div 
                  key={index} 
                  className="w-8 h-8 bg-gray-200 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">Overview of all payment transactions</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              {['Transaction ID', 'Phone Number', 'Payee Name', 'Driver Name', 'Date', 'Amount', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-gray-600 font-semibold uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr
                key={transaction.transactionId}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{transaction.transactionId}</td>
                <td className="px-6 py-4">{transaction.phoneNumber}</td>
                <td className="px-6 py-4">{transaction.payeeName}</td>
                <td className="px-6 py-4">{transaction.driverName}</td>
                <td className="px-6 py-4">{transaction.date}</td>
                <td className="px-6 py-4 font-semibold">£{transaction.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleView(transaction)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedTransactions.length === 0 && (
          <div className="text-center py-10 text-gray-500">No transactions found.</div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-600">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} 
          of {filteredTransactions.length} records
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md ${
                page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;