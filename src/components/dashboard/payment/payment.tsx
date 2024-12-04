import React, { useState } from 'react';
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

} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartLineIcon, FilterIcon } from 'lucide-react';

// Mock Data with more realistic structure
const topStatistics = [
  { 
    title: 'Total Revenue', 
    value: '68,250 RWF', 
    icon: ChartBarIcon, 
    change: '+12.5%',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  { 
    title: 'Successful Payments', 
    value: '3,215', 
    icon: CheckCircleIcon, 
    change: '+8.2%',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500'
  },
  { 
    title: 'Pending Transactions', 
    value: '682', 
    icon: ChartLineIcon, 
    change: '-3.1%',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-500'
  },
  { 
    title: 'Total Customers', 
    value: '1,245', 
    icon: UserCircleIcon, 
    change: '+15.7%',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500'
  }
];

// Graph Data
const graphData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const paymentMethods = [
  { 
    name: 'Credit Card', 
    balance: '25,215 RWF', 
    icon: CreditCardIcon,
    lastFour: '•••• 4532',
    color: 'text-blue-600'
  },
  { 
    name: 'Bank Transfer', 
    balance: '15,300 RWF', 
    icon: WalletIcon,
    lastFour: 'RWF Account',
    color: 'text-green-600'
  },
  { 
    name: 'Mobile Money', 
    balance: '8,750 RWF', 
    icon: ArrowTrendingUpIcon,
    lastFour: 'MTN Money',
    color: 'text-yellow-600'
  }
];

const recentTransactions = [
  { 
    id: '001', 
    name: 'Netflix Subscription', 
    date: 'Jun 15, 2024', 
    amount: '-5,500 RWF',
    status: 'Completed',
    avatar: UserCircleIcon
  },
  { 
    id: '002', 
    name: 'Freelance Project', 
    date: 'Jun 10, 2024', 
    amount: '+35,000 RWF',
    status: 'Processing',
    avatar: UserCircleIcon
  },
  { 
    id: '003', 
    name: 'Utility Bill', 
    date: 'Jun 5, 2024', 
    amount: '-12,300 RWF',
    status: 'Completed',
    avatar: UserCircleIcon
  }
];

const PaymentDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('This Month');
  const filters = ['This Week', 'This Month', 'This Quarter', 'This Year'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Top Statistics Cards */}
      <section className="grid grid-cols-4 gap-6 mb-8">
        {topStatistics.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} border border-gray-100 rounded-2xl shadow-lg p-6 transform transition-all hover:-translate-y-2 hover:shadow-xl`}
          >
            <div className="flex justify-between items-center mb-4">
              <stat.icon className={`h-10 w-10 ${stat.iconColor}`} />
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-3 gap-8">

        {/*Overview Graph */}
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
            <div className="flex space-x-2 bg-gray-100 rounded-full p-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeFilter === filter 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }} 
              />
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

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
            <FilterIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
          </div>
          
          <div className="space-y-6">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <method.icon className={`h-10 w-10 ${method.color}`} />
                  <div>
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.lastFour}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">{method.balance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <section className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
          <button className="text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
            View All
          </button>
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
                  <p className="font-semibold text-gray-800">{transaction.name}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {transaction.status}
                </span>
                <p className={`font-bold ${
                  transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.amount}
                </p>
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PaymentDashboard;