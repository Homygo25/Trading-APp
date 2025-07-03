import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  DollarSign,
  Percent,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PerformanceStats = () => {
  const { portfolio, tradingHistory, fetchPortfolio, loading } = useTradingContext();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPortfolio();
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate performance stats from portfolio and trading history
  const stats = [
    {
      label: 'Total Value',
      value: portfolio ? `$${portfolio.total_value?.toLocaleString() || '0'}` : '$0',
      change: portfolio?.day_change_percent || 0,
      icon: DollarSign,
      color: 'text-green-400',
      description: 'Total portfolio value'
    },
    {
      label: 'Day Change',
      value: portfolio ? `$${portfolio.day_change?.toLocaleString() || '0'}` : '$0',
      change: portfolio?.day_change_percent || 0,
      icon: portfolio?.day_change >= 0 ? TrendingUp : TrendingDown,
      color: portfolio?.day_change >= 0 ? 'text-green-400' : 'text-red-400',
      description: '24-hour change'
    },
    {
      label: 'Win Rate',
      value: portfolio?.performance?.win_rate ? `${portfolio.performance.win_rate.toFixed(1)}%` : '0%',
      change: 0, // Could calculate change over time
      icon: Target,
      color: 'text-blue-400',
      description: 'Winning trade percentage'
    },
    {
      label: 'Total Return',
      value: portfolio?.performance?.total_return ? `${portfolio.performance.total_return.toFixed(1)}%` : '0%',
      change: 0,
      icon: Percent,
      color: portfolio?.performance?.total_return >= 0 ? 'text-green-400' : 'text-red-400',
      description: 'Overall return percentage'
    },
    {
      label: 'Total Trades',
      value: portfolio?.performance?.total_trades?.toString() || '0',
      change: 0,
      icon: BarChart3,
      color: 'text-purple-400',
      description: 'Number of completed trades'
    },
    {
      label: 'Winning Trades',
      value: portfolio?.performance?.winning_trades?.toString() || '0',
      change: 0,
      icon: Zap,
      color: 'text-yellow-400',
      description: 'Number of profitable trades'
    },
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatChange = (change) => {
    if (change === 0) return '';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <motion.section
      aria-labelledby="performance-stats-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <header className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 id="performance-stats-heading" className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" aria-hidden="true" />
          <span>Performance</span>
        </h2>
        <Button
          size="xs"
          variant="ghost"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="text-gray-400 hover:text-white hover:bg-gray-700/50"
        >
          <RefreshCw className={`w-3 h-3 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
        </Button>
      </header>

      <div className="space-y-2 sm:space-y-3 flex-1 overflow-y-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 rounded-lg p-2 sm:p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors group"
              title={stat.description}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</p>
                    <p className={`text-sm sm:text-base font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
                
                {stat.change !== 0 && (
                  <div className="text-right">
                    <div className={`text-xs sm:text-sm font-medium ${getChangeColor(stat.change)} flex items-center space-x-1`}>
                      {stat.change > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : stat.change < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      <span>{formatChange(stat.change)}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Quick Performance Insights */}
      <div className="mt-2 space-y-1">
        {portfolio?.performance && (
          <>
            {portfolio.performance.win_rate > 70 && (
              <div className="text-xs text-green-400 bg-green-400/10 rounded px-2 py-1">
                🎯 Excellent win rate above 70%
              </div>
            )}
            {portfolio.performance.total_return > 10 && (
              <div className="text-xs text-blue-400 bg-blue-400/10 rounded px-2 py-1">
                📈 Strong total return above 10%
              </div>
            )}
            {portfolio.day_change_percent > 5 && (
              <div className="text-xs text-purple-400 bg-purple-400/10 rounded px-2 py-1">
                🚀 Great daily performance!
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
};

export default PerformanceStats;
