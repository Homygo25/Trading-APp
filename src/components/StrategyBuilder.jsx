
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Brain, 
  Plus, 
  Play, 
  Save,
  TrendingUp,
  Target,
  Shield,
  Clock
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const StrategyBuilder = () => {
  const [strategyName, setStrategyName] = useState('');
  const [marketType, setMarketType] = useState('crypto');
  const [timeframe, setTimeframe] = useState('1H');
  const [stopLoss, setStopLoss] = useState(2);
  const [takeProfit, setTakeProfit] = useState(5);
  const [positionSize, setPositionSize] = useState(1);

  const { toast } = useToast();

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 3000,
    });
  };

  const indicators = [
    { name: 'Moving Average', type: 'trend', icon: TrendingUp },
    { name: 'RSI', type: 'momentum', icon: Target },
    { name: 'MACD', type: 'momentum', icon: TrendingUp },
    { name: 'Bollinger Bands', type: 'volatility', icon: Shield },
    { name: 'Volume', type: 'volume', icon: Clock },
  ];

  const currentConditions = [
    'Price crosses above MA(20)',
    'RSI < 30 (Oversold)',
    'MACD bullish crossover',
  ];

  const riskRewardRatio = takeProfit && stopLoss ? (takeProfit / stopLoss).toFixed(1) : 'N/A';


  return (
    <motion.main
      aria-labelledby="strategy-builder-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full p-2 sm:p-4 flex flex-col overflow-y-auto scrollbar-hide"
    >
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h1 id="strategy-builder-heading" className="text-xl sm:text-2xl font-bold gradient-text flex items-center space-x-2 mb-2 sm:mb-0">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          <span>Strategy Builder</span>
        </h1>
        
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <Button
            size="sm"
            onClick={() => handleNotImplemented('Save Strategy')}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
            aria-label="Save current strategy"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
            Save
          </Button>
          <Button
            size="sm"
            onClick={() => handleNotImplemented('Backtest Strategy')}
            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
            aria-label="Backtest current strategy"
          >
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
            Backtest
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
        <section aria-labelledby="strategy-setup-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <h2 id="strategy-setup-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Strategy Setup</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="strategy-name" className="text-xs sm:text-sm">Strategy Name</Label>
              <Input
                id="strategy-name"
                type="text"
                placeholder="My Trading Strategy"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="market-type" className="text-xs sm:text-sm">Market Type</Label>
              <Select value={marketType} onValueChange={setMarketType}>
                <SelectTrigger id="market-type" className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select market type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto" className="text-xs sm:text-sm">Crypto</SelectItem>
                  <SelectItem value="forex" className="text-xs sm:text-sm">Forex</SelectItem>
                  <SelectItem value="stocks" className="text-xs sm:text-sm">Stocks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeframe" className="text-xs sm:text-sm">Timeframe</Label>
               <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger id="timeframe" className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1H" className="text-xs sm:text-sm">1H</SelectItem>
                  <SelectItem value="4H" className="text-xs sm:text-sm">4H</SelectItem>
                  <SelectItem value="1D" className="text-xs sm:text-sm">1D</SelectItem>
                  <SelectItem value="1W" className="text-xs sm:text-sm">1W</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-labelledby="entry-conditions-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 id="entry-conditions-heading" className="text-base sm:text-lg font-semibold text-white">Entry Conditions</h2>
            <Button
              size="xs"
              onClick={() => handleNotImplemented('Add Condition')}
              className="bg-green-600 hover:bg-green-700"
              aria-label="Add new entry condition"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Available Indicators</h3>
            {indicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-between p-2 bg-black/40 rounded border border-gray-700/50 hover:border-green-400/30 cursor-pointer transition-colors text-white hover:text-white"
                  onClick={() => handleNotImplemented(`Add ${indicator.name}`)}
                  aria-label={`Add ${indicator.name} indicator`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" aria-hidden="true" />
                    <span className="text-xs sm:text-sm">{indicator.name}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">{indicator.type}</span>
                </Button>
              );
            })}
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Current Conditions</h3>
            {currentConditions.length > 0 ? (
              <ul className="space-y-1 sm:space-y-2">
                {currentConditions.map((condition, index) => (
                  <li key={index} className="p-2 bg-green-600/20 border border-green-400/30 rounded text-xs sm:text-sm text-green-300">
                    {condition}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500">No conditions added yet.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="risk-management-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <h2 id="risk-management-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center space-x-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" aria-hidden="true" />
            <span>Risk Management</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="stop-loss" className="text-xs sm:text-sm">Stop Loss (%)</Label>
              <Input
                id="stop-loss"
                type="number"
                min="0.1" max="10" step="0.1"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                className="text-xs sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="take-profit" className="text-xs sm:text-sm">Take Profit (%)</Label>
              <Input
                id="take-profit"
                type="number"
                min="0.1" max="20" step="0.1"
                value={takeProfit}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                className="text-xs sm:text-sm"
              />
            </div>
            <div>
              <Label htmlFor="position-size" className="text-xs sm:text-sm">Position Size (%)</Label>
              <Input
                id="position-size"
                type="number"
                min="0.1" max="10" step="0.1"
                value={positionSize}
                onChange={(e) => setPositionSize(parseFloat(e.target.value))}
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="p-2 sm:p-3 bg-black/40 rounded border border-gray-700/50">
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Risk/Reward Ratio</p>
              <p className="text-base sm:text-lg font-semibold text-white">
                1:{riskRewardRatio}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-600/20 border border-blue-400/30 rounded">
              <p className="text-xs sm:text-sm text-blue-300 mb-1">AI Recommendation</p>
              <p className="text-[10px] sm:text-xs text-blue-200">
                Consider a 1:2 risk/reward ratio for optimal long-term performance.
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
};

export default StrategyBuilder;
