import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTradingContext } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Eye,
  EyeOff,
  DollarSign,
  Percent,
  BarChart3,
  Target,
  History,
  Filter,
  Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Portfolio = () => {
  const { 
    portfolio, 
    tradingHistory, 
    fetchPortfolio, 
    fetchTradingHistory, 
    loading 
  } = useTradingContext();
  
  const { toast } = useToast();
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState('positions');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPortfolio();
    fetchTradingHistory();
  }, [fetchPortfolio, fetchTradingHistory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchPortfolio(), fetchTradingHistory()]);
      toast({
        title: "🔄 Portfolio Refreshed",
        description: "Portfolio data has been updated",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "❌ Refresh Failed",
        description: "Unable to refresh portfolio data",
        duration: 3000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!showBalances) return '****';
    return `$${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
  };

  const formatPercent = (percent) => {
    const value = percent || 0;
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  // Portfolio allocation data for pie chart
  const allocationData = portfolio?.positions?.map(position => ({
    name: position.asset,
    value: position.quantity * position.current_price,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })) || [];

  // Performance data for bar chart
  const performanceData = tradingHistory?.slice(0, 10).map((trade, index) => ({
    trade: `Trade ${index + 1}`,
    pnl: trade.pnl,
    asset: trade.asset
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full p-2 sm:p-4 flex flex-col overflow-y-auto scrollbar-hide"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold gradient-text flex items-center space-x-2 mb-2 sm:mb-0">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Portfolio</span>
        </h1>
        
        <div className="flex items-center space-x-2 self-end sm:self-center">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setShowBalances(!showBalances)}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="signal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Value</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(portfolio?.total_value)}
          </div>
          <div className={`text-sm ${getChangeColor(portfolio?.day_change_percent)}`}>
            {formatPercent(portfolio?.day_change_percent)}
          </div>
        </div>

        <div className="signal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Day Change</span>
            {portfolio?.day_change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(portfolio?.day_change)}
          </div>
          <div className={`text-sm ${getChangeColor(portfolio?.day_change)}`}>
            Last 24 hours
          </div>
        </div>

        <div className="signal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Win Rate</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {portfolio?.performance?.win_rate?.toFixed(1) || '0.0'}%
          </div>
          <div className="text-sm text-gray-400">
            {portfolio?.performance?.winning_trades || 0} / {portfolio?.performance?.total_trades || 0} trades
          </div>
        </div>

        <div className="signal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Return</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatPercent(portfolio?.performance?.total_return)}
          </div>
          <div className="text-sm text-gray-400">
            All time
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-black/20 rounded-lg p-1">
        {['positions', 'history', 'analytics'].map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs capitalize ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'positions' && <Wallet className="w-4 h-4 mr-1" />}
            {tab === 'history' && <History className="w-4 h-4 mr-1" />}
            {tab === 'analytics' && <BarChart3 className="w-4 h-4 mr-1" />}
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'positions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Positions List */}
            <div className="lg:col-span-2 signal-card rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Current Positions</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {portfolio?.positions?.length === 0 || !portfolio?.positions ? (
                  <div className="text-center py-8 text-gray-400">
                    <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No open positions</p>
                  </div>
                ) : (
                  portfolio.positions.map((position, index) => (
                    <motion.div
                      key={position.asset}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/40 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{position.asset}</h4>
                        <div className={`text-sm font-medium ${getChangeColor(position.unrealized_pnl_percent)}`}>
                          {formatPercent(position.unrealized_pnl_percent)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs text-gray-400">
                        <div>
                          <span className="block text-gray-500">Quantity</span>
                          <span className="text-white">{position.quantity.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Avg Price</span>
                          <span className="text-white">${position.avg_price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Current Price</span>
                          <span className="text-white">${position.current_price.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700/50">
                        <span className="text-xs text-gray-400">Unrealized P&L</span>
                        <span className={`text-sm font-medium ${getChangeColor(position.unrealized_pnl)}`}>
                          {formatCurrency(position.unrealized_pnl)}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Portfolio Allocation */}
            <div className="signal-card rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Allocation</h3>
              {allocationData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data to display</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="signal-card rounded-lg p-4 h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Trading History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tradingHistory?.length === 0 || !tradingHistory ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No trading history</p>
                </div>
              ) : (
                tradingHistory.map((trade, index) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-black/40 rounded-lg p-3 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${
                          trade.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {trade.type === 'BUY' ? (
                            <TrendingUp className="w-3 h-3 text-white" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium text-white">{trade.asset}</span>
                        <span className="text-xs text-gray-400">{trade.type}</span>
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(trade.pnl)}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-400">
                      <div>
                        <span className="block text-gray-500">Quantity</span>
                        <span className="text-white">{trade.quantity}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Entry</span>
                        <span className="text-white">${trade.entry_price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Exit</span>
                        <span className="text-white">${trade.exit_price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Return</span>
                        <span className={getChangeColor(trade.pnl_percent)}>
                          {formatPercent(trade.pnl_percent)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs text-gray-500">
                      {new Date(trade.executed_at).toLocaleString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <div className="signal-card rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Recent P&L</h3>
              {performanceData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="trade" 
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
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [formatCurrency(value), 'P&L']}
                      />
                      <Bar dataKey="pnl" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No performance data</p>
                </div>
              )}
            </div>

            <div className="signal-card rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-medium">{portfolio?.performance?.total_trades || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Winning Trades</span>
                  <span className="text-green-400 font-medium">{portfolio?.performance?.winning_trades || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-blue-400 font-medium">{portfolio?.performance?.win_rate?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Total Return</span>
                  <span className={`font-medium ${getChangeColor(portfolio?.performance?.total_return)}`}>
                    {formatPercent(portfolio?.performance?.total_return)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Portfolio Value</span>
                  <span className="text-white font-medium">{formatCurrency(portfolio?.total_value)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default Portfolio;
