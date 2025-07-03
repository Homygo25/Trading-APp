import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  Brain, 
  Plus, 
  Play, 
  Save,
  TrendingUp,
  Target,
  Shield,
  Clock,
  BarChart3,
  Trash2,
  Settings,
  RefreshCw
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
  const [description, setDescription] = useState('');
  const [marketType, setMarketType] = useState('crypto');
  const [timeframe, setTimeframe] = useState('1H');
  const [stopLoss, setStopLoss] = useState(2);
  const [takeProfit, setTakeProfit] = useState(5);
  const [positionSize, setPositionSize] = useState(1);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [riskManagement, setRiskManagement] = useState({
    maxDailyLoss: 5,
    maxOpenPositions: 3,
    riskPerTrade: 2
  });
  const [backtestResults, setBacktestResults] = useState(null);

  const { 
    strategies, 
    createStrategy, 
    backtestStrategy, 
    loading,
    fetchStrategies 
  } = useTradingContext();
  const { toast } = useToast();

  const indicators = [
    { id: 'ma', name: 'Moving Average', type: 'trend', icon: TrendingUp, description: 'Simple/Exponential Moving Average' },
    { id: 'rsi', name: 'RSI', type: 'momentum', icon: Target, description: 'Relative Strength Index' },
    { id: 'macd', name: 'MACD', type: 'momentum', icon: TrendingUp, description: 'Moving Average Convergence Divergence' },
    { id: 'bb', name: 'Bollinger Bands', type: 'volatility', icon: Shield, description: 'Volatility indicator' },
    { id: 'volume', name: 'Volume', type: 'volume', icon: BarChart3, description: 'Trading volume analysis' },
    { id: 'stoch', name: 'Stochastic', type: 'momentum', icon: Clock, description: 'Stochastic Oscillator' },
  ];

  const handleIndicatorToggle = (indicatorId) => {
    setSelectedIndicators(prev => 
      prev.includes(indicatorId)
        ? prev.filter(id => id !== indicatorId)
        : [...prev, indicatorId]
    );
  };

  const handleSaveStrategy = async () => {
    if (!strategyName.trim()) {
      toast({
        title: "❌ Validation Error",
        description: "Strategy name is required",
        duration: 3000,
      });
      return;
    }

    const strategyData = {
      name: strategyName,
      description: description || `Custom strategy for ${marketType} trading`,
      market_type: marketType,
      timeframe,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      position_size: positionSize,
      indicators: selectedIndicators,
      risk_management: riskManagement,
      created_at: new Date().toISOString(),
    };

    try {
      await createStrategy(strategyData);
      // Reset form
      setStrategyName('');
      setDescription('');
      setSelectedIndicators([]);
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };

  const handleBacktest = async (strategyId) => {
    try {
      const results = await backtestStrategy(strategyId);
      setBacktestResults(results);
    } catch (error) {
      console.error('Error running backtest:', error);
    }
  };

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
            onClick={handleSaveStrategy}
            disabled={loading || !strategyName.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
            aria-label="Save current strategy"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" aria-hidden="true" />
            Save Strategy
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1">
        {/* Strategy Setup */}
        <section aria-labelledby="strategy-setup-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <h2 id="strategy-setup-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Strategy Setup</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="strategy-name" className="text-sm text-gray-300">Strategy Name</Label>
              <Input
                id="strategy-name"
                type="text"
                placeholder="Enter strategy name"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="mt-1 bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="strategy-description" className="text-sm text-gray-300">Description</Label>
              <textarea
                id="strategy-description"
                placeholder="Describe your trading strategy"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="market-type" className="text-sm text-gray-300">Market Type</Label>
                <Select value={marketType} onValueChange={setMarketType}>
                  <SelectTrigger id="market-type" className="mt-1 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Crypto</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeframe" className="text-sm text-gray-300">Timeframe</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger id="timeframe" className="mt-1 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1M">1 Minute</SelectItem>
                    <SelectItem value="5M">5 Minutes</SelectItem>
                    <SelectItem value="15M">15 Minutes</SelectItem>
                    <SelectItem value="1H">1 Hour</SelectItem>
                    <SelectItem value="4H">4 Hours</SelectItem>
                    <SelectItem value="1D">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="stop-loss" className="text-sm text-gray-300">Stop Loss (%)</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="take-profit" className="text-sm text-gray-300">Take Profit (%)</Label>
                <Input
                  id="take-profit"
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.1"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="position-size" className="text-sm text-gray-300">Position Size (%)</Label>
                <Input
                  id="position-size"
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={positionSize}
                  onChange={(e) => setPositionSize(parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Risk/Reward Ratio:</span>
                <span className="text-white font-medium">{riskRewardRatio}:1</span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Indicators */}
        <section aria-labelledby="indicators-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <h2 id="indicators-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Technical Indicators
          </h2>
          <div className="space-y-2">
            {indicators.map((indicator) => {
              const Icon = indicator.icon;
              const isSelected = selectedIndicators.includes(indicator.id);
              
              return (
                <div
                  key={indicator.id}
                  onClick={() => handleIndicatorToggle(indicator.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-green-400' : 'text-gray-400'}`} />
                      <div>
                        <h3 className="text-sm font-medium text-white">{indicator.name}</h3>
                        <p className="text-xs text-gray-400">{indicator.description}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded border ${
                      isSelected ? 'bg-green-400 border-green-400' : 'border-gray-400'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Selected: {selectedIndicators.length} indicators
          </div>
        </section>

        {/* Strategy Management & Backtest */}
        <section aria-labelledby="management-heading" className="signal-card rounded-lg p-3 sm:p-4">
          <h2 id="management-heading" className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Strategy Management
          </h2>

          {/* Existing Strategies */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Saved Strategies</h3>
            {strategies.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No strategies created yet</p>
              </div>
            ) : (
              strategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{strategy.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="xs"
                        onClick={() => handleBacktest(strategy.id)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>Win Rate: <span className="text-green-400">{strategy.win_rate?.toFixed(1)}%</span></div>
                    <div>Trades: <span className="text-white">{strategy.total_trades || 0}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Backtest Results */}
          {backtestResults && (
            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3 mb-4">
              <h3 className="text-sm font-medium text-blue-400 mb-2">Backtest Results</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">Win Rate: <span className="text-green-400">{backtestResults.win_rate?.toFixed(1)}%</span></div>
                <div className="text-gray-400">Total Return: <span className="text-blue-400">{backtestResults.total_return?.toFixed(1)}%</span></div>
                <div className="text-gray-400">Total Trades: <span className="text-white">{backtestResults.total_trades}</span></div>
                <div className="text-gray-400">Max Drawdown: <span className="text-red-400">{backtestResults.max_drawdown?.toFixed(1)}%</span></div>
                <div className="text-gray-400">Profit Factor: <span className="text-green-400">{backtestResults.profit_factor?.toFixed(2)}</span></div>
                <div className="text-gray-400">Sharpe Ratio: <span className="text-blue-400">{backtestResults.sharpe_ratio?.toFixed(2)}</span></div>
              </div>
            </div>
          )}

          {/* Risk Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Risk Management</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-400">Max Daily Loss (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={riskManagement.maxDailyLoss}
                  onChange={(e) => setRiskManagement(prev => ({
                    ...prev,
                    maxDailyLoss: parseFloat(e.target.value)
                  }))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white text-xs h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Max Open Positions</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={riskManagement.maxOpenPositions}
                  onChange={(e) => setRiskManagement(prev => ({
                    ...prev,
                    maxOpenPositions: parseInt(e.target.value)
                  }))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white text-xs h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Risk Per Trade (%)</Label>
                <Input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={riskManagement.riskPerTrade}
                  onChange={(e) => setRiskManagement(prev => ({
                    ...prev,
                    riskPerTrade: parseFloat(e.target.value)
                  }))}
                  className="mt-1 bg-gray-800 border-gray-600 text-white text-xs h-8"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
};

export default StrategyBuilder;
