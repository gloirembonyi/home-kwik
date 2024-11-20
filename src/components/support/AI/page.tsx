import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/base/card";
import { Button } from "@/components/ui/base/button";
import { 
  Bot, 
  Users, 
  Car, 
  TrendingUp, 
  ShieldAlert, 
  BarChart2, 
  CreditCard,
  Sparkles
} from 'lucide-react';
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

// AI Services Integration
const AIServices = {
  async generateInsights(data) {
    try {
      // Placeholder for actual AI API call (OpenAI/Google Gemini)
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('AI Insights Generation Failed', error);
      return [];
    }
  },

  async predictRideTrends(historicalData: { name: string; rides: number; revenue: number; }[]) {
    try {
      const response = await fetch('/api/ai-predictions', {
        method: 'POST',
        body: JSON.stringify(historicalData)
      });
      return await response.json();
    } catch (error) {
      console.error('Ride Trend Prediction Failed', error);
      return null;
    }
  }
};

// Advanced Analytics Dashboard
const KwikRideAIDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 5420,
    activeDrivers: 872,
    completedRides: 24563,
    revenue: 458620,
    aiInsights: [],
    ridePredictions: null
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sample chart data
  const rideData = [
    { name: 'Jan', rides: 400, revenue: 50000 },
    { name: 'Feb', rides: 300, revenue: 45000 },
    { name: 'Mar', rides: 200, revenue: 40000 },
    { name: 'Apr', rides: 278, revenue: 55000 },
    { name: 'May', rides: 189, revenue: 35000 },
    { name: 'Jun', rides: 239, revenue: 48000 },
  ];

  // Fetch and Generate AI Insights
  const fetchAIInsights = async () => {
    setIsLoading(true);
    try {
      const insights = await AIServices.generateInsights(dashboardData);
      const predictions = await AIServices.predictRideTrends(rideData);
      
      setDashboardData(prev => ({
        ...prev,
        aiInsights: insights,
        ridePredictions: predictions
      }));
    } catch (error) {
      console.error('Failed to fetch AI insights', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kwik Ride AI Dashboard</h1>
        <Button 
          onClick={fetchAIInsights} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? 'Generating Insights...' : 'Regenerate AI Insights'}
        </Button>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            icon: <Users className="text-blue-500"/>, 
            title: "Total Users", 
            value: dashboardData.totalUsers 
          },
          { 
            icon: <Car className="text-green-500"/>, 
            title: "Active Drivers", 
            value: dashboardData.activeDrivers 
          },
          { 
            icon: <BarChart2 className="text-purple-500"/>, 
            title: "Completed Rides", 
            value: dashboardData.completedRides 
          },
          { 
            icon: <CreditCard className="text-indigo-500"/>, 
            title: "Total Revenue", 
            value: `$${dashboardData.revenue.toLocaleString()}` 
          }
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights & Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* AI Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-blue-500" />
              AI Generated Insights
            </CardTitle>
            <CardDescription>Automated platform analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.aiInsights.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${insight.impact === 'high' ? 'bg-red-100 text-red-800' : 
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}
                      `}>
                        Impact: {insight.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No AI insights available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ride Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              Ride Trend Predictions
            </CardTitle>
            <CardDescription>AI-Powered Future Projections</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.ridePredictions ? (
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">
                    Predicted Rides Next Quarter
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData.ridePredictions.predictedRides}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800">
                    Estimated Revenue
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${dashboardData.ridePredictions.estimatedRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Predictions loading...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rides Analytics Chart */}
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Monthly Rides & Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rideData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="rides" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Rides"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default KwikRideAIDashboard;