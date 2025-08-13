import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';
import { GlassmorphicCard } from '../ui/GlassmorphicCard';
import { Gig, GigAnalytics as GigAnalyticsType } from '../../types/gig';

interface GigAnalyticsProps {
  gig: Gig;
  analytics: GigAnalyticsType[];
}

type PeriodType = '7d' | '30d' | '90d';

// Mock data for demonstration
const MOCK_ANALYTICS: GigAnalyticsType[] = [
  { gigId: '1', period: 'day', impressions: 125, clicks: 12, orders: 2, revenue: 0.3, conversionRate: 9.6, date: new Date('2024-02-20') },
  { gigId: '1', period: 'day', impressions: 98, clicks: 8, orders: 1, revenue: 0.15, conversionRate: 8.2, date: new Date('2024-02-19') },
  { gigId: '1', period: 'day', impressions: 156, clicks: 15, orders: 3, revenue: 0.45, conversionRate: 9.6, date: new Date('2024-02-18') },
  { gigId: '1', period: 'day', impressions: 134, clicks: 11, orders: 1, revenue: 0.15, conversionRate: 8.2, date: new Date('2024-02-17') },
  { gigId: '1', period: 'day', impressions: 187, clicks: 19, orders: 4, revenue: 0.6, conversionRate: 10.2, date: new Date('2024-02-16') },
  { gigId: '1', period: 'day', impressions: 142, clicks: 13, orders: 2, revenue: 0.3, conversionRate: 9.2, date: new Date('2024-02-15') },
  { gigId: '1', period: 'day', impressions: 178, clicks: 16, orders: 2, revenue: 0.3, conversionRate: 9.0, date: new Date('2024-02-14') }
];

const TRAFFIC_SOURCES = [
  { source: 'Search', percentage: 45, color: 'text-blue-400' },
  { source: 'Direct', percentage: 25, color: 'text-green-400' },
  { source: 'Category Browse', percentage: 20, color: 'text-purple-400' },
  { source: 'Recommendations', percentage: 10, color: 'text-yellow-400' }
];

const TOP_KEYWORDS = [
  { keyword: 'logo design', impressions: 1250, clicks: 89 },
  { keyword: 'business logo', impressions: 890, clicks: 67 },
  { keyword: 'professional logo', impressions: 678, clicks: 45 },
  { keyword: 'modern logo', impressions: 567, clicks: 38 },
  { keyword: 'creative logo', impressions: 445, clicks: 29 }
];

export const GigAnalytics: React.FC<GigAnalyticsProps> = ({ gig }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7d');
  const [analytics] = useState<GigAnalyticsType[]>(MOCK_ANALYTICS);

  // Calculate metrics based on selected period
  const calculateMetrics = () => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const relevantData = analytics.filter(a => a.date >= cutoffDate);
    
    const totalImpressions = relevantData.reduce((sum, a) => sum + a.impressions, 0);
    const totalClicks = relevantData.reduce((sum, a) => sum + a.clicks, 0);
    const totalOrders = relevantData.reduce((sum, a) => sum + a.orders, 0);
    const totalRevenue = relevantData.reduce((sum, a) => sum + a.revenue, 0);
    const avgConversionRate = relevantData.length > 0 
      ? relevantData.reduce((sum, a) => sum + a.conversionRate, 0) / relevantData.length 
      : 0;
    const clickThroughRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      orders: totalOrders,
      revenue: totalRevenue,
      conversionRate: avgConversionRate,
      clickThroughRate
    };
  };

  const metrics = calculateMetrics();

  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous period data for comparison
  const previousMetrics = {
    impressions: metrics.impressions * 0.85,
    clicks: metrics.clicks * 0.92,
    orders: metrics.orders * 0.78,
    revenue: metrics.revenue * 0.81
  };

  const metricCards = [
    {
      title: 'Impressions',
      value: metrics.impressions.toLocaleString(),
      change: getChangePercentage(metrics.impressions, previousMetrics.impressions),
      icon: Eye,
      color: 'text-blue-400 bg-blue-500/20'
    },
    {
      title: 'Clicks',
      value: metrics.clicks.toLocaleString(),
      change: getChangePercentage(metrics.clicks, previousMetrics.clicks),
      icon: MousePointer,
      color: 'text-green-400 bg-green-500/20'
    },
    {
      title: 'Orders',
      value: metrics.orders.toLocaleString(),
      change: getChangePercentage(metrics.orders, previousMetrics.orders),
      icon: ShoppingCart,
      color: 'text-purple-400 bg-purple-500/20'
    },
    {
      title: 'Revenue',
      value: `${metrics.revenue.toFixed(3)} SOL`,
      change: getChangePercentage(metrics.revenue, previousMetrics.revenue),
      icon: DollarSign,
      color: 'text-yellow-400 bg-yellow-500/20'
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gig Analytics</h1>
          <p className="text-white/70">{gig.title}</p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm ${
                  metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(metric.change).toFixed(1)}%
                </div>
              </div>
              <div>
                <p className="text-white/70 text-sm">{metric.title}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-white/70">Impressions</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-white/70">Clicks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-white/70">Orders</span>
            </div>
          </div>
        </div>
        
        {/* Simplified chart representation */}
        <div className="h-64 flex items-end space-x-2">
          {analytics.slice(0, 7).reverse().map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex flex-col space-y-1 mb-2">
                {/* Impressions bar */}
                <div
                  className="bg-blue-500/30 rounded-t"
                  style={{ height: `${(data.impressions / 200) * 60}px`, minHeight: '2px' }}
                ></div>
                {/* Clicks bar */}
                <div
                  className="bg-green-500/30"
                  style={{ height: `${(data.clicks / 20) * 60}px`, minHeight: '2px' }}
                ></div>
                {/* Orders bar */}
                <div
                  className="bg-purple-500/30 rounded-b"
                  style={{ height: `${(data.orders / 5) * 60}px`, minHeight: '2px' }}
                ></div>
              </div>
              <span className="text-xs text-white/70">{formatDate(data.date)}</span>
            </div>
          ))}
        </div>
      </GlassmorphicCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Metrics */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Conversion Metrics</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Click-through Rate</span>
                <span className="text-white font-semibold">{metrics.clickThroughRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.clickThroughRate * 2, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Conversion Rate</span>
                <span className="text-white font-semibold">{metrics.conversionRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                  style={{ width: `${Math.min(metrics.conversionRate * 3, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">{(metrics.revenue / metrics.orders || 0).toFixed(3)}</p>
                  <p className="text-white/70 text-sm">Avg. Order Value</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">{(metrics.clicks / metrics.impressions * 100 || 0).toFixed(1)}%</p>
                  <p className="text-white/70 text-sm">CTR</p>
                </div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Traffic Sources */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Traffic Sources</h3>
          
          <div className="space-y-4">
            {TRAFFIC_SOURCES.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${source.color.replace('text-', 'bg-')}`}></div>
                  <span className="text-white">{source.source}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${source.color.replace('text-', 'bg-')}`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold w-12 text-right">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicCard>
      </div>

      {/* Top Keywords */}
      <GlassmorphicCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Top Performing Keywords</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium pb-3">Keyword</th>
                <th className="text-right text-white/70 font-medium pb-3">Impressions</th>
                <th className="text-right text-white/70 font-medium pb-3">Clicks</th>
                <th className="text-right text-white/70 font-medium pb-3">CTR</th>
                <th className="text-right text-white/70 font-medium pb-3">Position</th>
              </tr>
            </thead>
            <tbody>
              {TOP_KEYWORDS.map((keyword, index) => {
                const ctr = (keyword.clicks / keyword.impressions) * 100;
                return (
                  <tr key={keyword.keyword} className="border-b border-white/10">
                    <td className="py-4 text-white">{keyword.keyword}</td>
                    <td className="py-4 text-white text-right">{keyword.impressions.toLocaleString()}</td>
                    <td className="py-4 text-white text-right">{keyword.clicks}</td>
                    <td className="py-4 text-white text-right">{ctr.toFixed(2)}%</td>
                    <td className="py-4 text-white text-right">#{index + 1}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassmorphicCard>

      {/* Recommendations */}
      <GlassmorphicCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Performance Recommendations</h3>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-1">Optimize for High-CTR Keywords</h4>
              <p className="text-white/70 text-sm">Focus on "logo design" and "business logo" - they have the highest click-through rates. Consider adding these to your title and tags.</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Activity className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-1">Improve Conversion Rate</h4>
              <p className="text-white/70 text-sm">Your CTR is good, but conversion could be higher. Consider updating your gig images and adding more detailed package descriptions.</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold mb-1">Expand Search Presence</h4>
              <p className="text-white/70 text-sm">45% of your traffic comes from search. Consider adding more relevant keywords to capture additional search traffic.</p>
            </div>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};
