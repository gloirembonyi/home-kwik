import React, { useState } from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/base/dialog";
import { Button } from "@/components/ui/base/button";
import PriceDistanceForm from "./PriceDistanceForm";

const PaymentMethod = () => {
  const [open, setOpen] = useState(false);

  const paymentMethods = [
    {
      name: "Cash",
      balance: "-1,540.50 RWF",
      color: "bg-green-100 text-green-600",
      icon: <WalletIcon className="h-5 w-5 text-green-600" />,
    },
    {
      name: "KWIK Wallet",
      balance: "-400.50 RWF",
      color: "bg-blue-100 text-blue-600",
      icon: <WalletIcon className="h-5 w-5 text-blue-600" />,
    },
    {
      name: "Mobile Money",
      balance: "-700.00 RWF",
      color: "bg-yellow-100 text-yellow-600",
      icon: <WalletIcon className="h-5 w-5 text-yellow-600" />,
    },
  ];

  const distanceAndPriceData = [
    { distance: "1 KM", priceRange: "2000 RWF - 5000 RWF", duration: "5.0" },
    { distance: "5 KM", priceRange: "2000 RWF - 5000 RWF", duration: "3.0" },
    { distance: "10 KM", priceRange: "2000 RWF - 5000 RWF", duration: "1.0" },
    { distance: "15 KM", priceRange: "2000 RWF - 5000 RWF", duration: "5.0" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm opacity-75 mb-2">Total Balance</p>
              <h2 className="text-4xl font-bold mb-4">25,215 RWF</h2>
              <div className="absolute top-0 right-0 p-4">
                <MoreVerticalIcon className="h-6 w-6 text-white/70 cursor-pointer hover:text-white transition" />
              </div>
              <div className="bg-white/10 absolute -bottom-10 -right-10 w-24 h-24 rounded-full"></div>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-600 mb-4">
              Payment Methods
            </h3>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${method.color} p-3 rounded-full`}>
                      {method.icon}
                    </div>
                    <span className="font-medium text-gray-800">
                      {method.name}
                    </span>
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {method.balance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distance and Price Table Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Distance, Price, and Duration
            </h3>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-900 text-white hover:bg-blue-800">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Price
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <PriceDistanceForm onClose={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
              <div className="bg-gray-100 rounded-full p-1">
                <button className="bg-white shadow-md px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Export
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="px-4 py-2 font-medium">Distance in KM</th>
                  <th className="px-4 py-2 font-medium">Price Range in RWF</th>
                  <th className="px-4 py-2 font-medium">Estimated Duration</th>
                  <th className="px-4 py-2 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {distanceAndPriceData.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {item.distance}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.priceRange}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.duration} hrs
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center space-x-3">
                        <EyeIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-500 transition" />
                        <PencilIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500 transition" />
                        <TrashIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-red-500 transition" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-500">Showing page 1 of 10</span>
            <div className="flex space-x-2">
              <button className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition">
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <button className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition">
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
