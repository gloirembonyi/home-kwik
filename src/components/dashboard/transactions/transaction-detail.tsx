import React, { FC } from "react";

type TransactionDetailsProps = {
  transaction: any; // Update with a specific type if needed
  onClose: () => void;
};

const TransactionDetails: FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">T001</h2>
            <p className="text-gray-500 text-sm">Transaction details of T001</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1"
          >
            <span className="material-icons">arrow_back</span>
            <span>Back</span>
          </button>
        </div>

        {/* Driver and Rider Details */}
        <div className="flex justify-between mb-8">
          {/* Driver Section */}
          <div className="w-1/2 text-center border-r pr-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500">
              <span className="material-icons text-4xl"></span>
            </div>
            <h3 className="text-lg font-semibold mt-4">Driver</h3>
            <p className="text-gray-700 text-sm mt-1">
              <strong>Names:</strong> {transaction.driverName || "Unknown"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Phone number:</strong> {transaction.driverPhone || "Not Available"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Gender:</strong> {transaction.driverGender || "Not Available"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Rating:</strong> {transaction.driverRating || "Not Available"}
            </p>
          </div>

          {/* Rider Section */}
          <div className="w-1/2 text-center pl-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500">
              <span className="material-icons text-4xl"></span>
            </div>
            <h3 className="text-lg font-semibold mt-4">Rider</h3>
            <p className="text-gray-700 text-sm mt-1">
              <strong>Names:</strong> {transaction.riderName || "Unknown"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Phone number:</strong> {transaction.riderPhone || "Not Available"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Gender:</strong> {transaction.riderGender || "Not Available"}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Rating:</strong> {transaction.riderRating || "Not Available"}
            </p>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="border rounded-lg bg-gray-50 p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Transaction ID</dt>
              <dd>{transaction.transactionId || "Not Available"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Distance covered</dt>
              <dd>{transaction.distance || "Not Available"} Kilometres</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Time taken</dt>
              <dd>{transaction.timeTaken || "Not Available"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Total amount</dt>
              <dd>{transaction.amount || "Not Available"} FRW</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Payment Method</dt>
              <dd>{transaction.paymentMethod || "Not Available"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Payment Account</dt>
              <dd>{transaction.paymentAccount || "Not Available"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-700">Status</dt>
              <dd>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    transaction.status === "Successful"
                      ? "bg-green-100 text-green-800"
                      : transaction.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Export Button */}
        <div className="text-right mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm">
            Export document
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
