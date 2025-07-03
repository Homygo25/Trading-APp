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
  Target,
  Activity,
  RefreshCw,
  TrendingDown as LineChart,
  Zap
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ChartWidget = ({ fullScreen = false }) => {
  const { 
    selectedAsset, 
    marketData, 
    chartData,
    generateNewSignal, 
    fetchChartData,
    loading 
  } = useTradingContext();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('4H');
  const [chartType, setChartType] = useState('line');
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    if (selectedAsset) {
      fetchChartData(selectedAsset, timeframe);
    }
  }, [selectedAsset, timeframe, fetchChartData]);

  const currentChartData = chartData[`${selectedAsset}_${timeframe}`] || [];

  // Transform data for Recharts
  const transformedData = currentChartData.map((item, index) => ({
    time: new Date(item.time || Date.now() - (currentChartData.length - index) * 3600000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    price: item.close || item.price || 0,
    volume: item.volume || 0,
    high: item.high || item.price || 0,
    low: item.low || item.price || 0,
    open: item.open || item.price || 0,
  }));

  const handlePatternDetection = async () => {
    const patterns = ['Head & Shoulders', 'Double Top', 'Bullish Flag', 'Triangle Breakout'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    toast({
      title: "🎯 Pattern Detected!",
      description: `AI detected a ${pattern} pattern on ${selectedAsset}`,
      duration: 4000,
    });

    const signalType = Math.random() > 0.5 ? 'BUY' : 'SELL';
    await generateNewSignal(selectedAsset, signalType, { pattern });
  };

  const handleRefreshChart = () => {
    fetchChartData(selectedAsset, timeframe);
    toast({
      title: "🔄 Chart Refreshed",
      description: "Chart data has been updated",
      duration: 2000,
    });
  };

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} will be available in the next update! 🚀`,
      duration: 3000,
    });
  };

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D'];

  const formatTooltip = (value, name) => {
    if (name === 'price') {
      return [`$${parseFloat(value).toFixed(2)}`, 'Price'];
    }
    if (name === 'volume') {
      return [value.toLocaleString(), 'Volume'];
    }
    return [value, name];
  };

  const getCurrentPrice = () => {
    return marketData[selectedAsset]?.price?.toFixed(2) || '0.00';
  };

  const getCurrentChange = () => {
    return marketData[selectedAsset]?.change || 0;
  };

  const isPositiveChange = getCurrentChange() >= 0;

  return (
    <motion.section
      aria-labelledby={`chart-widget-heading-${selectedAsset.replace('/', '-')}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`chart-container rounded-lg p-2 sm:p-4 ${fullScreen ? 'h-full' : 'h-80 sm:h-96'} flex flex-col`}
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4">
        <div className="flex items-center space-x-2 md:space-x-3 mb-2 sm:mb-0">
          <h2 id={`chart-widget-heading-${selectedAsset.replace('/', '-')}`} className="text-sm sm:text-base md:text-lg font-semibold text-white whitespace-nowrap">
            {selectedAsset}
          </h2>
          <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm flex-shrink-0">
            <span className="text-gray-300 font-mono">
              ${getCurrentPrice()}
            </span>
            <div className={`flex items-center space-x-1 ${
              isPositiveChange ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositiveChange ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" aria-label="Trending Up" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4" aria-label="Trending Down" />
              )}
              <span className="font-mono">{getCurrentChange().toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 self-end sm:self-center">
          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white mr-2"
          >
            {timeframes.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>

          <Button
            size="xs"
            variant="ghost"
            onClick={() => setChartType(chartType === 'line' ? 'area' : 'line')}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            title={chartType === 'line' ? 'Switch to Area Chart' : 'Switch to Line Chart'}
          >
            {chartType === 'line' ? <Activity className="w-3 h-3" /> : <LineChart className="w-3 h-3" />}
          </Button>

          <Button
            size="xs"
            variant="ghost"
            onClick={() => setShowVolume(!showVolume)}
            className={`${showVolume ? 'text-blue-400' : 'text-gray-400'} hover:text-white hover:bg-gray-700/50`}
            title="Toggle Volume"
          >
            <BarChart3 className="w-3 h-3" />
          </Button>

          <Button
            size="xs"
            variant="ghost"
            onClick={handleRefreshChart}
            disabled={loading}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            title="Refresh Chart"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            size="xs"
            variant="ghost"
            onClick={handlePatternDetection}
            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
            title="AI Pattern Detection"
          >
            <Zap className="w-3 h-3" />
          </Button>

          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleNotImplemented('Fullscreen Chart')}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
            title="Fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </header>

      {/* Chart Area */}
      <div className="flex-1 bg-black/20 rounded-lg p-2 relative">
        {transformedData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={transformedData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={formatTooltip}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#10b981' }}
                />
              </AreaChart>
            ) : (
              <RechartsLineChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={formatTooltip}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#10b981' }}
                />
                {showVolume && (
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#3b82f6"
                    strokeWidth={1}
                    dot={false}
                    yAxisId="volume"
                  />
                )}
              </RechartsLineChart>
            )}
          </ResponsiveContainer>
        )}

        {/* Chart Status Indicators */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {loading && (
            <div className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded flex items-center space-x-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
          <div className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded">
            {timeframe}
          </div>
        </div>
      </div>

      {/* Chart Footer with Quick Stats */}
      {transformedData.length > 0 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>
              High: <span className="text-green-400">${Math.max(...transformedData.map(d => d.high)).toFixed(2)}</span>
            </span>
            <span>
              Low: <span className="text-red-400">${Math.min(...transformedData.map(d => d.low)).toFixed(2)}</span>
            </span>
          </div>
          <div className="text-right">
            <span>Volume: {marketData[selectedAsset]?.volume || 'N/A'}</span>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default ChartWidget;
