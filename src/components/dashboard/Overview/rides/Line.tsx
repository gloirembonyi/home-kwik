import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const LineChartComponent = ({ timePeriod }: { timePeriod: string }) => {
  // Dynamic data based on time period
  const getChartData = (period: string) => {
    const baseData = {
      'Today': [
        { name: '6am', Rides: 5, Revenue: 3.5 },
        { name: '9am', Rides: 12, Revenue: 8.4 },
        { name: '12pm', Rides: 8, Revenue: 5.6 },
        { name: '3pm', Rides: 15, Revenue: 10.5 },
        { name: '6pm', Rides: 10, Revenue: 7 },
        { name: '9pm', Rides: 18, Revenue: 12.6 }
      ],
      'This Week': [
        { name: 'Mon', Rides: 20, Revenue: 14 },
        { name: 'Tue', Rides: 25, Revenue: 17.5 },
        { name: 'Wed', Rides: 22, Revenue: 15.4 },
        { name: 'Thu', Rides: 30, Revenue: 21 },
        { name: 'Fri', Rides: 28, Revenue: 19.6 },
        { name: 'Sat', Rides: 35, Revenue: 24.5 },
        { name: 'Sun', Rides: 32, Revenue: 22.4 }
      ],
      'This Month': [
        { name: 'Jan', Rides: 20, Revenue: 14 },
        { name: 'Feb', Rides: 40, Revenue: 28 },
        { name: 'Mar', Rides: 30, Revenue: 21 },
        { name: 'Apr', Rides: 60, Revenue: 42 },
        { name: 'May', Rides: 80, Revenue: 56 },
        { name: 'Jun', Rides: 28, Revenue: 19.6 },
        { name: 'Jul', Rides: 40, Revenue: 28 },
        { name: 'Aug', Rides: 60, Revenue: 42 },
        { name: 'Sep', Rides: 40, Revenue: 28 },
        { name: 'Oct', Rides: 80, Revenue: 56 },
        { name: 'Nov', Rides: 60, Revenue: 42 },
        { name: 'Dec', Rides: 50, Revenue: 35 }
      ],
      'This Year': [
        { name: 'Jan', Rides: 100, Revenue: 70 },
        { name: 'Feb', Rides: 120, Revenue: 84 },
        { name: 'Mar', Rides: 110, Revenue: 77 },
        { name: 'Apr', Rides: 150, Revenue: 105 },
        { name: 'May', Rides: 200, Revenue: 140 },
        { name: 'Jun', Rides: 180, Revenue: 126 },
        { name: 'Jul', Rides: 220, Revenue: 154 },
        { name: 'Aug', Rides: 240, Revenue: 168 },
        { name: 'Sep', Rides: 210, Revenue: 147 },
        { name: 'Oct', Rides: 250, Revenue: 175 },
        { name: 'Nov', Rides: 230, Revenue: 161 },
        { name: 'Dec', Rides: 270, Revenue: 189 }
      ]
    };

    return baseData[period as keyof typeof baseData] || baseData['This Month'];
  };

  const data = getChartData(timePeriod);

  // Custom gradient definitions
  const LinearGradient = () => (
    <defs>
      <linearGradient id="ridesGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="rgba(0, 123, 255, 0.3)" />
        <stop offset="95%" stopColor="rgba(0, 123, 255, 0.1)" />
      </linearGradient>
      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="rgba(40, 167, 69, 0.3)" />
        <stop offset="95%" stopColor="rgba(40, 167, 69, 0.1)" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="3" result="offsetblur"/>
        <feFlood floodColor="rgba(0,0,0,0.3)"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  );

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <LinearGradient />
          <CartesianGrid 
            vertical={false} 
            horizontal={true} 
            stroke="rgba(0,0,0,0.05)" 
            strokeDasharray="5 5"
          />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: "#6B7280", 
              fontSize: 12,
              fontWeight: 500 
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: "#6B7280", 
              fontSize: 12,
              fontWeight: 500 
            }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.9)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            labelStyle={{
              color: 'white',
              fontWeight: 600,
              marginBottom: '8px'
            }}
            itemStyle={{
              color: 'white',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px',
              fontFamily: 'inherit'
            }}
            formatter={(value) => (
              <span className="text-gray-600 text-sm">{value}</span>
            )}
          />
          <Line 
            type="monotone" 
            dataKey="Rides" 
            stroke="rgba(0, 123, 255, 1)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#ridesGradient)"
            filter="url(#shadow)"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2, 
              stroke: 'white',
              style: { 
                boxShadow: '0 0 10px rgba(0, 123, 255, 0.4)' 
              }
            }}
            dot={{ 
              r: 4, 
              fill: "rgba(0, 123, 255, 1)",
              strokeWidth: 0 
            }}
          />
          <Line 
            type="monotone" 
            dataKey="Revenue" 
            stroke="rgba(40, 167, 69, 1)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            filter="url(#shadow)"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2, 
              stroke: 'white',
              style: { 
                boxShadow: '0 0 10px rgba(40, 167, 69, 0.4)' 
              }
            }}
            dot={{ 
              r: 4, 
              fill: "rgba(40, 167, 69, 1)",
              strokeWidth: 0 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};