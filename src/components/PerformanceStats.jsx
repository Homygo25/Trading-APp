
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Shield, Zap } from 'lucide-react';

const PerformanceStats = () => {
  const stats = [
    {
      label: 'Total Profit',
      value: '+$12,450',
      change: 15.2,
      icon: TrendingUp,
      color: 'text-green-400',
      'aria-label': 'Total Profit: +$12,450, Change: +15.2%'
    },
    {
      label: 'Win Rate',
      value: '78.5%',
      change: 3.1,
      icon: Target,
      color: 'text-blue-400',
      'aria-label': 'Win Rate: 78.5%, Change: +3.1%'
    },
    {
      label: 'Max Drawdown',
      value: '-2.1%',
      change: -0.5,
      icon: Shield,
      color: 'text-yellow-400',
      'aria-label': 'Max Drawdown: -2.1%, Change: -0.5%'
    },
  ];

  return (
    <motion.section
      aria-labelledby="performance-stats-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <h2 id="performance-stats-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" aria-hidden="true" />
        <span>Performance</span>
      </h2>

      <div className="space-y-2 sm:space-y-3 flex-1">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 rounded p-2 sm:p-3 border border-gray-700/50"
              aria-label={stat['aria-label']}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} aria-hidden="true" />
                <div className={`text-[10px] sm:text-xs ${
                  stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </div>
              </div>
              <div className="text-white font-semibold text-sm sm:text-lg">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-gray-400">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-black/20 rounded border border-gray-700/50" role="figure" aria-label="30-Day Performance Chart">
        <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">30-Day Performance</div>
        <div className="flex items-end space-x-0.5 sm:space-x-1 h-12 sm:h-16" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-sm opacity-70"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PerformanceStats;
