// components/DriverPerformanceChart.tsx

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/base/card";
import { Spinner } from "@/components/ui/spinner";
import mixpanel from "mixpanel-browser";
import { useEffect, memo } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";



interface AnalyticsData {
  date: string;
  rides: number;
  revenue: number;
}

interface PerformanceChartProps {
  data: AnalyticsData[];
  loading?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = memo(({ data, loading = false }) => {
  // Track chart view with Mixpanel
  useEffect(() => {
    mixpanel.track('View Performance Chart');
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Revenue and ride trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {/* Loading State */}
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner /> {/*component for loading */}
            </div>
          ) : data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                
                {/* X Axis with custom date formatting */}
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  label={{ value: "Date", position: "insideBottomRight", offset: -5 }}
                />
                
                {/* Dual Y Axes */}
                <YAxis 
                  yAxisId="left" 
                  label={{ value: "Rides", angle: -90, position: "insideLeft" }} 
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "Revenue ($)", angle: -90, position: "insideRight" }}
                />
                
                {/* Tooltip with custom formatting */}
                <Tooltip 
                  formatter={(value, name) => 
                    name === "Revenue ($)" ? `$${value.toLocaleString()}` : value
                  }
                  labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                />

                {/* Lines for Rides and Revenue */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rides"
                  stroke="#8884d8"
                  name="Rides"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Revenue ($)"
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            // Empty state
            <div className="text-center text-muted">
              No data available to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default PerformanceChart;
