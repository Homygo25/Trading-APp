
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '@/contexts/TradingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTicker = () => {
  const { marketData } = useTradingContext();
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const data = Object.entries(marketData).map(([asset, data]) => ({
      asset,
      ...data,
    }));
    setTickerData(data);
  }, [marketData]);

  if (tickerData.length === 0) {
    return null; 
  }

  return (
    <section aria-label="Live market ticker" className="market-ticker h-12 flex items-center overflow-hidden">
      <motion.div
        className="flex items-center space-x-8 whitespace-nowrap"
        animate={{ x: [0, - (tickerData.length * 250)] }} 
        transition={{
          duration: tickerData.length * 5, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {tickerData.concat(tickerData).map((item, index) => (
          <div key={`${item.asset}-${index}`} className="flex items-center space-x-2 text-sm" role="listitem">
            <span className="font-medium text-white">{item.asset}</span>
            <span className="text-gray-300">
              ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
            </span>
            <div className={`flex items-center space-x-1 ${
              item.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" aria-label="Trending up" />
              ) : (
                <TrendingDown className="w-3 h-3" aria-label="Trending down" />
              )}
              <span>{item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%</span>
            </div>
            <span className="text-gray-500 text-xs">Vol: {item.volume}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default MarketTicker;
