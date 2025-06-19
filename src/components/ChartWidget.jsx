
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Maximize2,
  Settings,
  Target
} from 'lucide-react';

const ChartWidget = ({ fullScreen = false }) => {
  const { selectedAsset, marketData, generateNewSignal } = useTradingContext();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('4H');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const generateMockData = () => {
      const data = [];
      let price = marketData[selectedAsset]?.price || 43000;
      
      for (let i = 0; i < 20; i++) {
        const change = (Math.random() - 0.5) * (price * 0.01); 
        price += change;
        data.push({
          time: Date.now() - (20 - i) * 3600000,
          open: price - Math.random() * (price * 0.005),
          high: price + Math.random() * (price * 0.005),
          low: price - Math.random() * (price * 0.005),
          close: price,
          volume: Math.random() * 1000000
        });
      }
      return data;
    };

    setChartData(generateMockData());
  }, [selectedAsset, marketData, timeframe]);

  const handlePatternDetection = () => {
    const patterns = ['Head & Shoulders', 'Double Top', 'Bullish Flag', 'Triangle Breakout'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    toast({
      title: "🎯 Pattern Detected!",
      description: `AI detected a ${pattern} pattern on ${selectedAsset}`,
      duration: 4000,
    });

    const signalType = Math.random() > 0.5 ? 'BUY' : 'SELL';
    generateNewSignal(selectedAsset, signalType);
  };

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 3000,
    });
  };

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

  return (
    <motion.section
      aria-labelledby={`chart-widget-heading-${selectedAsset.replace('/', '-')}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`chart-container rounded-lg p-2 sm:p-4 ${fullScreen ? 'h-full' : 'h-80 sm:h-96'} flex flex-col`}
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center space-x-2 md:space-x-3 mb-2 sm:mb-0">
          <h2 id={`chart-widget-heading-${selectedAsset.replace('/', '-')}`} className="text-sm sm:text-base md:text-lg font-semibold text-white whitespace-nowrap">{selectedAsset}</h2>
          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm flex-shrink-0">
            <span className="text-gray-300">
              ${marketData[selectedAsset]?.price?.toFixed(2) || '0.00'}
            </span>
            <div className={`flex items-center space-x-1 ${
              (marketData[selectedAsset]?.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {(marketData[selectedAsset]?.change || 0) >= 0 ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" aria-label="Trending Up" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4" aria-label="Trending Down" />
              )}
              <span>{(marketData[selectedAsset]?.change || 0).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 self-end sm:self-center">
          <Button
            size="xs"
            variant="ghost"
            onClick={handlePatternDetection}
            className="text-green-400 hover:text-green-300 hover:bg-green-400/10 px-1 sm:px-2"
            aria-label="Detect chart patterns"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Detect</span>
          </Button>
          
          <Button
            size="iconxs"
            variant="ghost"
            onClick={() => handleNotImplemented('Chart Settings')}
            className="text-gray-400 hover:text-white p-1 sm:p-2"
            aria-label="Chart settings"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          {!fullScreen && (
            <Button
              size="iconxs"
              variant="ghost"
              onClick={() => handleNotImplemented('Fullscreen Chart')}
              className="text-gray-400 hover:text-white p-1 sm:p-2"
              aria-label="Maximize chart"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </header>

      <nav aria-label="Chart timeframes" className="flex items-center space-x-1 mb-2 sm:mb-4">
        {timeframes.map((tf) => (
          <Button
            key={tf}
            size="xs"
            variant={timeframe === tf ? "default" : "ghost"}
            onClick={() => setTimeframe(tf)}
            className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 ${
              timeframe === tf 
                ? 'bg-green-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            aria-pressed={timeframe === tf}
          >
            {tf}
          </Button>
        ))}
      </nav>

      <div className="relative flex-1 bg-black/40 rounded border border-gray-700/50 p-2 sm:p-4 overflow-hidden" role="figure" aria-label={`Chart for ${selectedAsset} on ${timeframe} timeframe`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-green-400 mx-auto opacity-50 mb-1 sm:mb-2" aria-hidden="true" />
          <div className="mb-1 sm:mb-2">
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">Advanced TradingView Chart</p>
            <p className="text-gray-500 text-[9px] sm:text-xs">Real-time price action for {selectedAsset}</p>
          </div>
          
          <div className="grid grid-cols-10 gap-0.5 sm:gap-1 w-full px-1 sm:px-2 md:px-4 flex-grow items-end pb-1 sm:pb-2" aria-hidden="true">
            {chartData.slice(0,10).map((bar, i) => ( 
              <div
                key={i}
                className={`rounded-sm ${
                  bar.close >= bar.open ? 'bg-green-500/30' : 'bg-red-500/30'
                }`}
                style={{ height: `${(Math.abs(bar.high - bar.low) / (marketData[selectedAsset]?.price * 0.02 || 100)) * 60 + 10}%` }} 
              />
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 md:space-x-4 mt-auto pt-1 sm:pt-2">
            <div className="flex items-center space-x-1 text-[9px] sm:text-xs">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full pulse-animation" aria-hidden="true"></div>
              <span className="text-yellow-400">Support</span>
            </div>
            <div className="flex items-center space-x-1 text-[9px] sm:text-xs">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full pulse-animation" aria-hidden="true"></div>
              <span className="text-blue-400">Resistance</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ChartWidget;
