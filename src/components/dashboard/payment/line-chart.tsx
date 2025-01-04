import React from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Graph Data
const graphData = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
];

const GradientLineChart = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Today's Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Axes */}
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                background: "white",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />

            {/* Gradient Areas */}
            <Area
              type="monotone"
              dataKey="income"
              fill="url(#incomeGradient)"
              stroke="none"
            />
            <Area
              type="monotone"
              dataKey="expense"
              fill="url(#expenseGradient)"
              stroke="none"
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
    </div>
  );
};

export default GradientLineChart;
