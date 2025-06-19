
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock,
  Star
} from 'lucide-react';

const SignalPanel = ({ simplified = false }) => {
  const { signals, selectedAsset, generateNewSignal } = useTradingContext();
  const { toast } = useToast();

  const handleExecuteSignal = (signal) => {
    toast({
      title: "🚧 Trading Execution Coming Soon!",
      description: "Direct trading execution isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 3000,
    });
  };

  const handleGenerateSignal = () => {
    const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const newSignal = generateNewSignal(selectedAsset, type);
    
    toast({
      title: `🎯 New ${type} Signal Generated!`,
      description: `AI detected a ${newSignal.pattern} pattern on ${selectedAsset}`,
      duration: 4000,
    });
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
        </h2>
        
        <Button
          size="xs"
          onClick={handleGenerateSignal}
          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm self-end sm:self-center"
        >
          Generate Signal
        </Button>
      </header>

      <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto scrollbar-hide">
        {signals.length === 0 ? (
          <div className="text-center py-4 sm:py-8 text-gray-400 flex flex-col items-center justify-center h-full">
            <Target className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm sm:text-base">No active signals</p>
            <p className="text-xs sm:text-sm">Click "Generate Signal" to start</p>
          </div>
        ) : (
          signals.slice(0, simplified ? 3 : 10).map((signal) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 rounded-lg p-2 sm:p-3 border border-gray-700/50 hover:border-green-400/30 transition-colors"
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
                  <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${getRiskColor(signal.risk)}`}>
                    {signal.risk} Risk
                  </div>
                  <div className={`font-medium ${getConfidenceColor(signal.confidence)}`}>
                    {signal.confidence}% Conf.
                  </div>
                </div>
              </div>

              {!simplified && (
                <div className="grid grid-cols-3 gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                  <div>
                    <span className="block text-gray-500">Entry</span>
                    <span className="text-white">${signal.entry.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Target</span>
                    <span className="text-green-400">${signal.target.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Stop Loss</span>
                    <span className="text-red-400">${signal.stopLoss.toFixed(2)}</span>
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
                    <span>{signal.pattern}</span>
                  </div>
                </div>
                
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleExecuteSignal(signal)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"
                  aria-label={`Execute ${signal.type} signal for ${signal.asset}`}
                >
                  Execute
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
};

export default SignalPanel;
