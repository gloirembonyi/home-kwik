import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChartBarIcon,
  CheckCircleIcon,
  WalletIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { ChartLineIcon, FilterIcon } from "lucide-react";
import Dropdown from "./dropdown";
import PaymentMethod from "./PaymentMethod";
import { ArrowRightIcon } from "@radix-ui/react-icons";

// Mock Data with more realistic structure
const topStatistics = [
  {
    title: "Total Revenue",
    value: "68,250 RWF",
    icon: ChartBarIcon,
    change: "+12.5%",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Successful Payments",
    value: "3,215",
    icon: CheckCircleIcon,
    change: "+8.2%",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Pending Transactions",
    value: "682",
    icon: ChartLineIcon,
    change: "-3.1%",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    title: "Total Customers",
    value: "1,245",
    icon: UserCircleIcon,
    change: "+15.7%",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

const topCardGraph = [
  {
    title: "Total Revenue",
    value: "43.50%",
    icon: ChartBarIcon,
    change: "+12.5%",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Successful Payments",
    value: "$3,215",
    icon: CheckCircleIcon,
    change: "+8.2%",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
  }
];

// Graph Data
const graphData = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
];

const paymentMethods = [
  {
    name: "Credit Card",
    balance: "25,215 RWF",
    icon: CreditCardIcon,
    lastFour: "•••• 4532",
    color: "text-blue-600",
  },
  {
    name: "Bank Transfer",
    balance: "15,300 RWF",
    icon: WalletIcon,
    lastFour: "RWF Account",
    color: "text-green-600",
  },
  {
    name: "Mobile Money",
    balance: "8,750 RWF",
    icon: ArrowTrendingUpIcon,
    lastFour: "MTN Money",
    color: "text-yellow-600",
  },
];

const recentTransactions = [
  {
    id: "001",
    name: "Alex Mandana",
    date: "Jun 15, 2024",
    amount: "-5,500 RWF",
    status: "Completed",
    avatar: UserCircleIcon,
  },
  {
    id: "002",
    name: "Laura kampiriki",
    date: "Jun 10, 2024",
    amount: "+35,000 RWF",
    status: "Processing",
    avatar: UserCircleIcon,
  },
  {
    id: "003",
    name: "Jadon samuel",
    date: "Jun 5, 2024",
    amount: "-12,300 RWF",
    status: "Completed",
    avatar: UserCircleIcon,
  },
];

const PaymentDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("This Month");
  const filters = ["This Week", "This Month", "This Quarter", "This Year"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Statistics Cards */}
      <section className="grid grid-cols-4 gap-6 mb-6">
        {topStatistics.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-100 transition-colors"
          >
            <stat.icon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-3 gap-6">
        {/*Overview Graph */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">Today's Stats</h2>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs ml-4">
                On Track
              </span>
            </div>
            {/* Integrate Dropdown */}
            <Dropdown 
              filters={filters} 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
            />
          </div>
          {/* two Card Above the graph */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {topCardGraph.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-100 transition-colors"
              >
                <stat.icon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <button className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs ml-4">{stat.change}</button>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              {/* Gradient Area */}
              <Area
                type="monotone"
                dataKey="income"
                stroke="none"
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="none"
                fill="url(#expenseGradient)"
              />
              {/* Lines */}
              <Line
                type="monotone"
                dataKey="income"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>
        {/* Recent Transactions */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Top Earnings Users
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors rounded-xl px-4"
              >
                <div className="flex items-center space-x-4">
                  <transaction.avatar className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {transaction.name}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p
                    className={`font-bold ${
                      transaction.amount.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.amount}
                  </p>
                  <EllipsisVerticalIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
            <div className="flex items-center flex-1 p-8 m-6 ">
              <button className=" flex items-center text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
                View All <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
        </section>
      </div>

      {/* Payment Methods */}
      <PaymentMethod />
    </div>
  );
};

export default PaymentDashboard;
