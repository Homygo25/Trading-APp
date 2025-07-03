import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  Star,
  Play,
  X,
  RefreshCw,
  Filter,
  MoreVertical
} from 'lucide-react';

const SignalPanel = ({ simplified = false }) => {
  const { 
    signals, 
    selectedAsset, 
    generateNewSignal, 
    executeSignal,
    loading,
    fetchSignals 
  } = useTradingContext();
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const handleExecuteSignal = async (signal) => {
    try {
      await executeSignal(signal);
    } catch (error) {
      // Error is already handled in context
    }
  };

  const handleGenerateSignal = async () => {
    try {
      const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
      await generateNewSignal(selectedAsset, type);
    } catch (error) {
      toast({
        title: "❌ Signal Generation Failed",
        description: "Unable to generate signal. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleRefreshSignals = async () => {
    try {
      await fetchSignals();
      toast({
        title: "🔄 Signals Refreshed",
        description: "Signal data has been updated",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "❌ Refresh Failed",
        description: "Unable to refresh signals",
        duration: 3000,
      });
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'high': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'executed': return 'text-blue-400 bg-blue-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      case 'active': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Filter signals based on selected filters
  const filteredSignals = signals.filter(signal => {
    if (filterType !== 'all' && signal.type !== filterType) return false;
    if (filterRisk !== 'all' && signal.risk.toLowerCase() !== filterRisk) return false;
    return true;
  });

  const displaySignals = simplified ? filteredSignals.slice(0, 3) : filteredSignals.slice(0, 10);

  return (
    <motion.section
      aria-labelledby="signal-panel-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4">
        <h2 id="signal-panel-heading" className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2 mb-2 sm:mb-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" aria-hidden="true" />
          <span>AI Trading Signals</span>
          {signals.length > 0 && (
            <span className="text-xs text-gray-400">({signals.length})</span>
          )}
        </h2>
        
        <div className="flex items-center space-x-2 self-end sm:self-center">
          {!simplified && (
            <>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={handleRefreshSignals}
                disabled={loading}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </>
          )}
          <Button
            size="xs"
            onClick={handleGenerateSignal}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
          >
            {loading ? (
              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Target className="w-3 h-3 mr-1" />
            )}
            Generate
          </Button>
        </div>
      </header>

      {/* Filters */}
      {showFilters && !simplified && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-3 p-3 bg-black/30 rounded-lg border border-gray-700/50"
        >
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
              >
                <option value="all">All</option>
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Risk:</span>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto scrollbar-hide">
        {displaySignals.length === 0 ? (
          <div className="text-center py-4 sm:py-8 text-gray-400 flex flex-col items-center justify-center h-full">
            <Target className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm sm:text-base">No active signals</p>
            <p className="text-xs sm:text-sm">Click "Generate" to create AI signals</p>
          </div>
        ) : (
          displaySignals.map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 rounded-lg p-2 sm:p-3 border border-gray-700/50 hover:border-green-400/30 transition-colors group"
              role="article"
              aria-labelledby={`signal-asset-${signal.id}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 sm:mb-2">
                <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                  <div className={`p-1 rounded ${
                    signal.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'
                  }`} aria-hidden="true">
                    {signal.type === 'BUY' ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    ) : (
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <span id={`signal-asset-${signal.id}`} className="font-medium text-sm sm:text-base text-white">{signal.asset}</span>
                    <span className={`ml-2 text-xs sm:text-sm font-bold ${
                      signal.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {signal.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-[10px] sm:text-xs self-end sm:self-center">
                  {signal.status && (
                    <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] ${getStatusColor(signal.status)}`}>
                      {signal.status.toUpperCase()}
                    </div>
                  )}
                  <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${getRiskColor(signal.risk)}`}>
                    {signal.risk} Risk
                  </div>
                  <div className={`font-medium ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}%
                  </div>
                </div>
              </div>

              {!simplified && (
                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                  <div>
                    <span className="block text-gray-500">Entry</span>
                    <span className="text-white">${(signal.entry || signal.stop_loss || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Target</span>
                    <span className="text-green-400">${(signal.target || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Stop Loss</span>
                    <span className="text-red-400">${(signal.stopLoss || signal.stop_loss || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                    <span>{signal.timeframe}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                    <span className="truncate max-w-20">{signal.pattern}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {signal.status !== 'executed' && signal.status !== 'cancelled' && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleExecuteSignal(signal)}
                      disabled={loading}
                      className="text-green-400 hover:text-green-300 hover:bg-green-400/10 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
                      aria-label={`Execute ${signal.type} signal for ${signal.asset}`}
                    >
                      {loading ? (
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          Execute
                        </>
                      )}
                    </Button>
                  )}
                  {!simplified && (
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-gray-600/50 px-1"
                    >
                      <MoreVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {signal.executed_at && (
                <div className="mt-2 pt-2 border-t border-gray-700/50 text-[10px] text-gray-500">
                  Executed: {new Date(signal.executed_at).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {!simplified && filteredSignals.length > 10 && (
        <div className="mt-3 text-center">
          <Button
            size="xs"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Show More ({filteredSignals.length - 10} remaining)
          </Button>
        </div>
      )}
    </motion.section>
  );
};

export default SignalPanel;
