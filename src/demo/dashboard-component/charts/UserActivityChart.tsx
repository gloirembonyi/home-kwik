// src/components/charts/UserActivityChart.tsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define the UserActivity type if not already defined
type UserActivity = {
  date: string; // Assuming date is a string; adjust based on your data type
  activeUsers: number;
};

interface UserActivityChartProps {
  data: UserActivity[];
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
      >
        {/* Add a gradient for the area fill */}
        <defs>
          <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Add a grid for better readability */}
        <CartesianGrid strokeDasharray="3 3" />

        {/* Customize the X-axis and Y-axis labels */}
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
          label={{ value: "Date", position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{
            value: "Active Users",
            angle: -90,
            position: "insideLeft",
          }}
        />

        {/* Customize tooltip */}
        <Tooltip
          formatter={(value: number) => new Intl.NumberFormat('en').format(value)}
          labelFormatter={(label: string) =>
            `Date: ${new Date(label).toLocaleDateString()}`
          }
        />

        {/* Add a legend for clarity */}
        <Legend verticalAlign="top" height={36} />

        {/* Define the area with a gradient fill */}
        <Area
          type="monotone"
          dataKey="activeUsers"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorActiveUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default UserActivityChart;
