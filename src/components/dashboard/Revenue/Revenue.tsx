import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { PieChart, Pie, Cell, Label } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Calendar, Clock, DollarSign, Truck, Briefcase, MapPin, TrendingUp, RefreshCcw } from "lucide-react";

const Revenue = () => {
  // Sample data
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [driverEarnings, setDriverEarnings] = useState(0);
  const [platformCommission, setPlatformCommission] = useState(0);

  // Sample data for sales revenue chart
  const [dashboardState, setDashboardState] = useState({
    totalRevenue: 0,
    driverEarnings: 0,
    platformCommission: 0,
    lastUpdated: new Date()
  });

  // Sample data for sales revenue chart with more granular details
  const [salesRevenueData, setSalesRevenueData] = useState([
    { month: "Jan", revenue: 0, cost: 0, profit: 0 },
    { month: "Feb", revenue: 0, cost: 0, profit: 0 },
    { month: "Mar", revenue: 0, cost: 0, profit: 0 },
    { month: "Apr", revenue: 0, cost: 0, profit: 0 },
    { month: "May", revenue: 0, cost: 0, profit: 0 },
    { month: "Jun", revenue: 0, cost: 0, profit: 0 },
    { month: "Jul", revenue: 0, cost: 0, profit: 0 },
    { month: "Aug", revenue: 0, cost: 0, profit: 0 },
    { month: "Sep", revenue: 0, cost: 0, profit: 0 },
    { month: "Oct", revenue: 0, cost: 0, profit: 0 },
    { month: "Nov", revenue: 0, cost: 0, profit: 0 },
    { month: "Dec", revenue: 0, cost: 0, profit: 0 }
  ]);

  // Enhanced location data with more context
  const [revenueByLocation, setRevenueByLocation] = useState([
    { 
      location: "Kigali", 
      percentage: 0, 
      value: 0, 
      coordinates: [-1.9403, 30.0610],
      color: "#3B82F6"
    },
    { 
      location: "Eastern Province", 
      percentage: 0, 
      value: 0, 
      coordinates: [-1.6077, 30.4916],
      color: "#10B981"
    },
    { 
      location: "Western Province", 
      percentage: 0, 
      value: 0, 
      coordinates: [-1.9706, 29.2275],
      color: "#F43F5E"
    },
    { 
      location: "Northern Province", 
      percentage: 0, 
      value: 0, 
      coordinates: [-1.6368, 29.8698],
      color: "#F97316"
    },
    { 
      location: "Southern Province", 
      percentage: 0, 
      value: 0, 
      coordinates: [-2.3054, 29.3713],
      color: "#8B5CF6"
    }
  ]);

  // Enhanced payment method data
  const [paymentMethodBreakdown, setPaymentMethodBreakdown] = useState([
    { method: "Cash", value: 0, icon: "💵" },
    { method: "Kwik-Wallet", value: 0, icon: "📱" },
    { method: "Mobile Money", value: 0, icon: "💳" },
    { method: "Credit Card", value: 0, icon: "💳" }
  ]);

  // Enhanced driver earnings with more details
  const [driverEarningsData, setDriverEarningsData] = useState([
    { 
      name: "Aime KARAKE", 
      rating: 0, 
      amount: 0, 
      trips: 0, 
      avatar: "https://randomuser.me/api/portraits/men/1.jpg" 
    },
   
  ]);

  // Memoized calculations for performance
  const totalPaymentMethodValue = useMemo(() => 
    paymentMethodBreakdown.reduce((sum, method) => sum + method.value, 0), 
    [paymentMethodBreakdown]
  );

  // Refresh data handler
  const handleRefreshData = () => {
    setDashboardState(prev => ({
      ...prev,
      lastUpdated: new Date()
    }));
    // Add logic to fetch new data if connected to backend
  };


  // Function to update total revenue
  const handleTotalRevenueChange = (newRevenue: React.SetStateAction<number>) => {
    setTotalRevenue(newRevenue);
  };

  // Function to update driver earnings
  const handleDriverEarningsChange = (newEarnings: React.SetStateAction<number>) => {
    setDriverEarnings(newEarnings);
  };

  // Function to update platform commission
  const handlePlatformCommissionChange = (newCommission: React.SetStateAction<number>) => {
    setPlatformCommission(newCommission);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-6 grid gap-6">
          {/* Dashboard Title with enhanced styling */}
          <div className="max-w-6x mb-2 flex justify-between items-center bg-white rounded-xl shadow-lg p-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="mr-4 text-blue-500" size={36} />
              Revenue
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 flex items-center">
                <Clock className="mr-2 text-blue-500" size={16} />
                Last Updated: {dashboardState.lastUpdated.toLocaleString()}
              </span>
              <button 
                onClick={handleRefreshData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <RefreshCcw className="mr-2" size={16} />
                Refresh Data
              </button>
            </div>
          </div>
          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-6 mb-4">
            {[

              
              {
                title: "Total Revenue",
                value: totalRevenue,
                icon: <DollarSign className="text-red-500" size={16} />,
                bgColor: "bg-red-50",
                onClick: () => handleTotalRevenueChange(totalRevenue + 5000)
              },
              {
                title: "Driver Earnings",
                value: driverEarnings,
                icon: <Truck className="text-orange-500" size={16} />,
                bgColor: "bg-orange-50",
                onClick: () => handleDriverEarningsChange(driverEarnings + 1000)
              },
              {
                title: "Platform Commission",
                value: platformCommission,
                icon: <Briefcase className="text-green-500" size={16} />,
                bgColor: "bg-green-50",
                onClick: () => handlePlatformCommissionChange(platformCommission + 500)
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex justify-between items-center border-l-4 border-blue-500"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value.toLocaleString()} RWF
                  </p>
                </div>
                <button
                  onClick={stat.onClick}
                  className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center hover:scale-110 transform transition-transform`}
                >
                  {stat.icon}
                </button>
              </div>
            ))}
          </div>

          {/* Sales Revenue Chart */}
          <div className="bg-white rounded-xl shadow-lg mb-6 p-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <TrendingUp className="mr-3 text-blue-500" size={24} />
                Sales Revenue Trends
              </h3>
              <div className="flex items-center space-x-4">
                <Calendar className="text-gray-500" size={18} />
                <select className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  {["Today", "Week", "Month", "Year"].map(period => (
                    <option key={period}>Sort By: {period}</option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesRevenueData}>
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff", 
                    border: "1px solid #e0e0e0", 
                    borderRadius: "8px" 
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-span-2">

          {/* Driver Earnings */}
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Truck className="mr-3 text-indigo-500" size={24} />
                Driver Earnings
              </h3>
              <button className="text-sm text-blue-600 flex items-center hover:text-blue-800 transition-colors">
                <Clock className="mr-2" size={16} />
                See All Drivers
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {driverEarningsData.map((driver, index) => (
                <li
                  key={index}
                  className="py-4 flex justify-between items-center text-sm text-gray-800 hover:bg-gray-50 px-3 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-gray-500 text-xs flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {driver.rating} <span className="text-gray-400 ml-2">Rating</span>
                    </p>
                  </div>
                  <span className="font-bold bg-green-100 px-3 py-1 rounded-full">
                    {driver.amount.toLocaleString()} RWF
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Location and Payment*/}

      <div className="grid grid-cols-8 gap-6">
        
        {/* Revenue by Location */}
        <div className="bg-white rounded-xl shadow-lg col-span-6 grid p-6 border-t-4 border-green-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-3 text-green-500" size={24} />
            Revenue by Location
          </h3>
          <MapContainer
            center={[-1.9440, 29.8739]}
            zoom={7}
            scrollWheelZoom={false}
            style={{ 
              height: "240px", 
              borderRadius: "0.75rem", 
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap Contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {revenueByLocation.map((location, index) => (
              <Marker
                key={index}
                position={[
                  -1.9440 + (index - 2) * 0.5,
                  29.8739 + (index - 2) * 0.5
                ]}
              >
                <Popup>
                  {location.location}: {location.percentage}%
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <ul className="mt-4 space-y-2">
            {revenueByLocation.map((location, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="font-medium">{location.location}</span>
                <span className="font-bold text-gray-900 bg-green-100 px-2 py-1 rounded-full">
                  {location.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Method*/}
        <div className="bg-white rounded-xl col-span-2 shadow-lg p-6 border-t-4 border-purple-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="mr-3 text-purple-500" size={24} />
            Rides per Payment Method
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={paymentMethodBreakdown}
                dataKey="value"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {paymentMethodBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#3B82F6", "#10B981", "#F43F5E", "#F97316"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-4 space-y-2">
            {paymentMethodBreakdown.map((method, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span className="font-medium">{method.method}</span>
                <span className="font-bold text-gray-900 bg-blue-100 px-2 py-1 rounded-full">
                  {method.value.toLocaleString()} RWF
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      
    </div>
  );
};

export default Revenue;