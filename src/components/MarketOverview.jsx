
import React from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '@/contexts/TradingContext';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const MarketOverview = () => {
  const { marketData } = useTradingContext();

  const marketStats = [
    { label: 'Total Volume', value: '$2.4B', change: 12.5, icon: DollarSign, 'aria-label': 'Total Volume: $2.4B, Change: +12.5%' },
    { label: 'Active Signals', value: '8', change: 3, icon: Activity, 'aria-label': 'Active Signals: 8, Change: +3%' },
    { label: 'Win Rate', value: '78%', change: 5.2, icon: TrendingUp, 'aria-label': 'Win Rate: 78%, Change: +5.2%' },
    { label: 'Avg Return', value: '4.2%', change: -1.1, icon: TrendingDown, 'aria-label': 'Average Return: 4.2%, Change: -1.1%' },
  ];

  const topMovers = Object.entries(marketData)
    .sort((a, b) => Math.abs(b[1].change) - Math.abs(a[1].change))
    .slice(0, 3);

  return (
    <motion.section
      aria-labelledby="market-overview-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <h2 id="market-overview-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center space-x-2">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" aria-hidden="true" />
        <span>Market Overview</span>
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-black/40 rounded p-2 sm:p-3 border border-gray-700/50" aria-label={stat['aria-label']}>
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" aria-hidden="true" />
                <div className={`text-[10px] sm:text-xs flex items-center space-x-1 ${
                  stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div className="text-white font-semibold text-sm sm:text-base">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex-1">
        <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Top Movers</h3>
        <ul className="space-y-1.5 sm:space-y-2">
          {topMovers.map(([asset, data]) => (
            <li key={asset} className="flex items-center justify-between p-1.5 sm:p-2 bg-black/20 rounded">
              <span className="text-xs sm:text-sm text-white">{asset}</span>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-300">
                  ${typeof data.price === 'number' ? data.price.toFixed(2) : data.price}
                </span>
                <div className={`text-[10px] sm:text-xs flex items-center space-x-0.5 sm:space-x-1 ${
                  data.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {data.change >= 0 ? (
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                  )}
                  <span>{data.change >= 0 ? '+' : ''}{data.change?.toFixed(1)}%</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default MarketOverview;
