import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/base/card';
import { Badge } from '@/components/ui/base/badge';
import { TrendingUp, TrendingDown, Minus, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailItem {
  label: string;
  value: number;
}

interface MetricData {
  category: string;
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  details: DetailItem[];
}

const mockData = [
  {
    category: "Overall Satisfaction",
    score: 92,
    previousScore: 89,
    trend: 'up',
    details: [
      { label: "Service Quality", value: 94 },
      { label: "Cleanliness", value: 90 },
      { label: "Value", value: 88 }
    ]
  },
  {
    category: "Driver Rating",
    score: 88,
    previousScore: 88,
    trend: 'stable',
    details: [
      { label: "Professionalism", value: 92 },
      { label: "Safety", value: 95 },
      { label: "Communication", value: 85 }
    ]
  },
  {
    category: "Trip Experience",
    score: 85,
    previousScore: 87,
    trend: 'down',
    details: [
      { label: "Comfort", value: 86 },
      { label: "Timeliness", value: 82 },
      { label: "Route Efficiency", value: 87 }
    ]
  },
  {
    category: "App Experience",
    score: 90,
    previousScore: 86,
    trend: 'up',
    details: [
      { label: "Ease of Use", value: 92 },
      { label: "Booking Process", value: 89 },
      { label: "Payment Experience", value: 91 }
    ]
  }
];

const CustomerSatisfaction: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);
  const [hoveredDetail, setHoveredDetail] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const transform = `translateY(${window.pageYOffset * 0.05}px)`;
        cardRef.current.style.setProperty('transform', transform);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgressColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getBackgroundGradient = (trend: MetricData['trend']): string => {
    switch (trend) {
      case 'up':
        return 'bg-gradient-to-r from-green-50 to-white';
      case 'down':
        return 'bg-gradient-to-r from-red-50 to-white';
      default:
        return 'bg-gradient-to-r from-gray-50 to-white';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="shadow-2xl rounded-xl bg-white"
    >
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Customer Satisfaction
            </CardTitle>
            <CardDescription className="text-gray-600">
              Real-time satisfaction metrics and trends
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800">
            Last 7d
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-8">
          {mockData.map((metric, index) => (
            <motion.div
            key={index}
            className={`p-4 rounded-lg transition-all transform hover:scale-102 ${
              getBackgroundGradient(metric.trend as "up" | "down" | "stable")
            } ${selectedMetric === index ? "ring-2 ring-blue-400" : ""}`}
            onClick={() => setSelectedMetric(selectedMetric === index ? null : index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-gray-900">{metric.category}</span>
                    {metric.trend === 'up' && (
                      <motion.div
                        initial={{ rotate: -45 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                    {metric.trend === 'down' && (
                      <motion.div
                        initial={{ rotate: 45 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      </motion.div>
                    )}
                    {metric.trend === 'stable' && (
                      <Minus className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Previous: {metric.previousScore}%</span>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`font-medium ${
                        metric.score > metric.previousScore
                          ? 'text-green-600'
                          : metric.score < metric.previousScore
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {metric.score > metric.previousScore ? '+' : ''}
                      {metric.score - metric.previousScore}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{metric.score}%</div>
                </div>
              </div>

              <div className="relative pt-2">
                <motion.div
                  className={`h-2 rounded-full ${getProgressColor(metric.score)}`}
                  style={{ width: `${metric.score}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>

              <AnimatePresence>
                {selectedMetric === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {metric.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className={`relative p-3 rounded-lg transition-all duration-200 cursor-pointer
                            ${
                              hoveredDetail === `${index}-${idx}`
                                ? 'bg-blue-50 transform scale-105'
                                : 'bg-white shadow-sm hover:shadow-md'
                            }`}
                          onMouseEnter={() => setHoveredDetail(`${index}-${idx}`)}
                          onMouseLeave={() => setHoveredDetail(null)}
                        >
                          <div className="text-center space-y-1">
                            <div className="text-sm font-medium text-gray-600">{detail.label}</div>
                            <div className="text-lg font-bold text-gray-900">
                              {detail.value}%
                            </div>
                          </div>
                          {hoveredDetail === `${index}-${idx}` && (
                            <div className="absolute -top-1 -right-1">
                              <Info className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="flex justify-end mt-4 text-gray-500 cursor-pointer"
                onClick={() => setSelectedMetric(selectedMetric === index ? null : index)}
                whileHover={{ color: '#1f2937' }}
              >
                <span className="mr-1">
                  {selectedMetric === index ? 'Hide Details' : 'View Details'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    selectedMetric === index ? 'transform rotate-180' : ''
                  }`}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </motion.div>
  );
};

export default CustomerSatisfaction;