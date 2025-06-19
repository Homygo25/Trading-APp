
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '@/contexts/TradingContext';
import { Shield, AlertTriangle, TrendingUp } from 'lucide-react';

const RiskMeter = () => {
  const { signals } = useTradingContext();
  const [currentRisk, setCurrentRisk] = useState(45);

  useEffect(() => {
    const calculateRisk = () => {
      if (signals.length === 0) return 30;
      
      const riskScores = signals.map(signal => {
        switch (signal.risk.toLowerCase()) {
          case 'low': return 20;
          case 'medium': return 50;
          case 'high': return 80;
          default: return 40;
        }
      });
      
      const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
      return Math.min(Math.max(avgRisk, 10), 90);
    };

    setCurrentRisk(calculateRisk());
  }, [signals]);

  const getRiskColor = (risk) => {
    if (risk <= 30) return 'text-green-400';
    if (risk <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLabel = (risk) => {
    if (risk <= 30) return 'Low Risk';
    if (risk <= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskIcon = (risk) => {
    if (risk <= 30) return Shield;
    if (risk <= 60) return TrendingUp;
    return AlertTriangle;
  };

  const RiskIcon = getRiskIcon(currentRisk);

  return (
    <motion.section
      aria-labelledby="risk-meter-heading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <header className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 id="risk-meter-heading" className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
          <RiskIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${getRiskColor(currentRisk)}`} aria-hidden="true" />
          <span>Risk Meter</span>
        </h2>
      </header>

      <div className="flex flex-col items-center space-y-2 sm:space-y-4 flex-1 justify-around">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32" role="meter" aria-valuenow={currentRisk} aria-valuemin="0" aria-valuemax="100" aria-label={`Current risk level: ${Math.round(currentRisk)}%`}>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(75, 85, 99, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke={currentRisk <= 30 ? '#22c55e' : currentRisk <= 60 ? '#eab308' : '#ef4444'}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentRisk / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - currentRisk / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-xl sm:text-2xl font-bold ${getRiskColor(currentRisk)}`}>
                {Math.round(currentRisk)}%
              </div>
              <div className="text-xs text-gray-400">Risk</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className={`text-base sm:text-lg font-semibold ${getRiskColor(currentRisk)}`}>
            {getRiskLabel(currentRisk)}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Portfolio Risk Assessment
          </p>
        </div>

        <div className="w-full space-y-1 sm:space-y-2 text-xs sm:text-sm" aria-label="Risk breakdown">
          <div className="flex justify-between">
            <span className="text-gray-400">Market Volatility</span>
            <span className="text-yellow-400">{Math.round(currentRisk * 0.6)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Position Size</span>
            <span className="text-green-400">{Math.round(currentRisk * 0.3)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Correlation Risk</span>
            <span className="text-red-400">{Math.round(currentRisk * 0.1)}%</span>
          </div>
        </div>

        <div className="w-full p-2 sm:p-3 bg-black/40 rounded border border-gray-700/50">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">AI Recommendation</p>
          <p className="text-xs sm:text-sm text-white">
            {currentRisk <= 30 && "Consider increasing position sizes."}
            {currentRisk > 30 && currentRisk <= 60 && "Maintain current risk levels."}
            {currentRisk > 60 && "Consider reducing position sizes."}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default RiskMeter;
