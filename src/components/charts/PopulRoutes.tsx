import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Activity,
  MapPin,
  Clock,
  Users,
  Star
} from 'lucide-react';

const mockData = [
  {
    route: "Downtown Express",
    count: 1234,
    change: 8.5,
    startPoint: "Central Station",
    endPoint: "Business District",
    popularity: 98
  },
  {
    route: "Airport Shuttle",
    count: 987,
    change: -2.3,
    startPoint: "City Center",
    endPoint: "International Airport",
    popularity: 92
  },
  {
    route: "University Line",
    count: 856,
    change: 5.7,
    startPoint: "Student Housing",
    endPoint: "Main Campus",
    popularity: 89
  },
  {
    route: "Shopping Express",
    count: 743,
    change: 12.1,
    startPoint: "Residential Area",
    endPoint: "Mall Complex",
    popularity: 85
  },
  {
    route: "Beach Route",
    count: 654,
    change: 3.2,
    startPoint: "Transit Hub",
    endPoint: "Coastal Area",
    popularity: 82
  }
];

const PopularRoutes = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);


  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 backdrop-blur-sm">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 rotate-45 transform transition-transform duration-1000 hover:rotate-90">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="absolute inset-0 animate-ping">
                <Activity className="w-6 h-6 text-blue-400 opacity-20" />
              </div>
              <Activity className="w-6 h-6 text-transparent" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-1xl font-bold bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent bg-300% animate-gradient">
                Popular Routes
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <Badge className="bg-blue-100/80 text-blue-600 hover:bg-blue-200 transition-all duration-300 backdrop-blur-sm">
                  Last 24h
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-blue-600">
              {mockData.reduce((acc, route) => acc + route.count, 0).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">total rides</span>
          </div>
        </div>
        <CardDescription className="text-gray-600 flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>Most active transportation corridors by passenger volume</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {mockData.map((route, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(null)}
            >
              <div className={`
                absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-400/5 to-blue-300/5
                rounded-xl transition-all duration-500 opacity-0 group-hover:opacity-100
                ${selectedIndex === index ? 'opacity-100' : ''}
              `} />
              
              <div className={`
                absolute inset-0 border border-blue-200/50 rounded-xl
                transition-all duration-500 opacity-0 group-hover:opacity-100
                ${selectedIndex === index ? 'opacity-100' : ''}
              `} />

              <div className="relative p-4 rounded-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      flex items-center justify-center w-12 h-12
                      rounded-xl bg-gradient-to-br from-blue-500 to-blue-600
                      text-white font-bold text-lg shadow-lg
                      group-hover:scale-110 group-hover:rotate-3
                      transition-all duration-300
                      ${selectedIndex === index ? 'scale-110 rotate-3' : ''}
                    `}>
                      {index + 1}
                      <div className="absolute inset-0 rounded-xl bg-blue-400  opacity-0 group-hover:opacity-20" />
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {route.route}
                        </span>
                        <div className={`
                          flex items-center space-x-1 text-xs text-blue-500
                          opacity-0 group-hover:opacity-100
                          ${selectedIndex === index ? 'opacity-100' : ''}
                        `}>
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          <span>{route.popularity}% popularity</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="font-medium">{route.startPoint}</span>
                        <div className="relative mx-2">
                          <ArrowRight className="w-5 h-5 text-blue-400" />
                          <div className="absolute inset-0 group-hover:animate-ping">
                            <ArrowRight className="w-5 h-5 text-blue-300 opacity-30" />
                          </div>
                        </div>
                        <span className="font-medium">{route.endPoint}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-lg text-blue-600 group-hover:scale-105 transition-transform duration-300">
                        {route.count.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className={`
                      flex items-center px-3 py-1 rounded-full
                      ${route.change >= 0 
                        ? 'text-green-600 bg-green-100/80 group-hover:bg-green-100' 
                        : 'text-red-600 bg-red-100/80 group-hover:bg-red-100'
                      } transition-colors duration-300
                    `}>
                      {route.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-semibold">{Math.abs(route.change)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className={`
                  absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600
                  scale-y-0 group-hover:scale-y-100 transition-transform duration-500 rounded-l-xl
                  ${selectedIndex === index ? 'scale-y-100' : ''}
                `} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularRoutes;